'use server'

import { getUser, isOrganizerAdmin } from '@/lib/auth/lucia'
import prisma from '@/lib/prisma'
import {
  EventTicketInputSchema,
  EventTicketInputType,
  SavedEventSchema,
  SavedTicketSchema,
  SavedTicketType
} from '@/schemas/eventSchema'
import { getEvent } from './getEvent'

export async function updateEvent(
  eventId: string,
  eventData: unknown,
  rawTickets: unknown[]
) {
  const event = await getEvent(eventId)
  if (!event) throw new Error('Event not found')

  const currentUser = await getUser()
  if (
    !currentUser ||
    !(await isOrganizerAdmin(event.organizationId, currentUser.id))
  ) {
    throw new Error('Unauthorized')
  }

  const validatedData = SavedEventSchema.parse(eventData)

  // Parse tickets with either SavedTicketSchema or EventTicketInputSchema
  const parsedTickets: (SavedTicketType | EventTicketInputType)[] =
    rawTickets.map(ticket => {
      // If ticket has an id, it's an existing ticket so use SavedTicketSchema
      if (typeof ticket === 'object' && ticket !== null && 'id' in ticket) {
        return SavedTicketSchema.parse(ticket)
      }
      // Otherwise it's a new ticket so use EventTicketInputSchema
      return EventTicketInputSchema.parse(ticket)
    })

  // Fetch existing tickets
  const existingTickets = await prisma.ticketOfferings.findMany({
    where: { eventId }
  })

  const purchaseMap = new Map<string, boolean>()
  // Check for existing ticket purchases
  for (const ticket of existingTickets) {
    const hasPurchases = await prisma.ticket.count({
      where: { ticketTypeId: ticket.id }
    })
    if (
      hasPurchases > 0 &&
      !parsedTickets.some(t => 'id' in t && t.id === ticket.id)
    ) {
      throw new Error('Cannot delete tickets that have already been purchased')
    }
    purchaseMap.set(ticket.id, hasPurchases > 0)
  }

  // Update or create tickets
  for (const ticket of parsedTickets) {
    if ('id' in ticket) {
      // Update existing ticket
      await prisma.ticketOfferings.update({
        where: { id: ticket.id },
        data: ticket
      })
    } else {
      // Create new ticket
      await prisma.ticketOfferings.create({
        data: {
          ...ticket,
          eventId: eventId
        }
      })
    }
  }

  // Delete tickets that are not in the new list and have no purchases
  const ticketsToDelete = existingTickets.filter(
    existingTicket =>
      !parsedTickets.some(t => 'id' in t && t.id === existingTicket.id) &&
      !purchaseMap.get(existingTicket.id)
  )

  await prisma.ticketOfferings.deleteMany({
    where: {
      id: { in: ticketsToDelete.map(t => t.id) }
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { tickets, ...parsedEventData } = validatedData

  // Update the event
  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: parsedEventData
  })

  return SavedEventSchema.parse({ ...updatedEvent, tickets: parsedTickets })
}
