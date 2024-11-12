import { getUser, isOrganizerAdmin } from '@/lib/auth/lucia'
import prisma from '@/lib/prisma'
import {
  EventInputSchema,
  EventTicketInputSchema,
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
  const tickets = rawTickets.map(v => EventTicketInputSchema.parse(v))

  const event = await prisma.event.create({
    data: {
      ...validatedData,
      organizationId: orgId,
      startDate: new Date(validatedData.startDate),
      endDate: new Date(validatedData.endDate)
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
