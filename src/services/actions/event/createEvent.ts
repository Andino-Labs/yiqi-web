'use server'

import { getUser, isOrganizerAdmin } from '@/lib/auth/lucia'
import prisma from '@/lib/prisma'
import {
  EventInputSchema,
  EventTicketOfferingInputSchema,
  EventTypeEnum,
  SavedEventSchema
} from '@/schemas/eventSchema'

export async function createEvent(
  orgId: string,
  eventData: unknown,
  rawTickets: unknown[]
) {
  const currentUser = await getUser()

  if (!currentUser || !(await isOrganizerAdmin(orgId, currentUser.id))) {
    throw new Error('Unauthorized')
  }

  const validatedData = EventInputSchema.parse(eventData)
  const tickets = rawTickets.map(v => EventTicketOfferingInputSchema.parse(v))

  if (
    validatedData.type === EventTypeEnum.IN_PERSON &&
    !validatedData.location
  ) {
    throw new Error('Location is required for in-person events')
  }

  if (
    validatedData.type === EventTypeEnum.ONLINE &&
    !validatedData.virtualLink
  ) {
    throw new Error('Virtual link is required for online events')
  }

  const event = await prisma.event.create({
    data: {
      ...validatedData,
      organizationId: orgId,
      startDate: new Date(validatedData.startDate),
      endDate: new Date(validatedData.endDate),
      latLon: validatedData.latLon ?? undefined
    }
  })

  await prisma.ticketOfferings.createMany({
    data: tickets.map(ticket => ({
      ...ticket,
      eventId: event.id
    }))
  })
  const createdTickets = await prisma.ticketOfferings.findMany({
    where: {
      eventId: event.id
    }
  })
  console.log('createdTickets', createdTickets)

  return SavedEventSchema.parse({ ...event, tickets: createdTickets })
}
