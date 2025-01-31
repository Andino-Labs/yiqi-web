'use server'

import { getUser, isOrganizerAdmin } from '@/lib/auth/lucia'
import prisma from '@/lib/prisma'
import {
  EventTicketOfferingInputSchema,
  EventTicketInputType,
  SavedEventSchema,
  SavedTicketOfferingSchema,
  SavedTicketOfferingType
} from '@/schemas/eventSchema'
import { getEvent } from './getEvent'

export async function updateEvent(
  eventId: string,
  eventData: unknown,
  rawTickets: unknown[]
) {
  const event = await getEvent({ eventId, includeTickets: true })
  if (!event) throw new Error('Event not found')

  const currentUser = await getUser()
  if (
    !currentUser ||
    !(await isOrganizerAdmin(event.organizationId, currentUser.id))
  ) {
    throw new Error('Unauthorized')
  }

  const validatedData = SavedEventSchema.parse({
    ...event,
    ...(eventData as object)
  })

  // Parse tickets with either SavedTicketSchema or EventTicketOfferingInputSchema
  const parsedTickets: (SavedTicketOfferingType | EventTicketInputType)[] =
    rawTickets.map(ticket => {
      // If ticket has an id, it's an existing ticket so use SavedTicketSchema
      if (typeof ticket === 'object' && ticket !== null && 'id' in ticket) {
        return SavedTicketOfferingSchema.parse(ticket)
      }
      // Otherwise it's a new ticket so use EventTicketOfferingInputSchema
      return EventTicketOfferingInputSchema.parse(ticket)
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
    data: {
      ...parsedEventData,
      customFields: JSON.stringify(parsedEventData.customFields),
      latLon: parsedEventData.latLon ?? undefined
    }
  })

  return SavedEventSchema.parse({ ...updatedEvent, tickets: parsedTickets })
}
