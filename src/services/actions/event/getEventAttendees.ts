'use server'

import prisma from '@/lib/prisma'
import { eventRegistrationsSchema } from '@/schemas/eventSchema'

export async function getEventRegistrations(eventId: string) {
  const attendees = await prisma.eventRegistration.findMany({
    where: { eventId },
    include: { user: true, tickets: true }
  })

  return attendees.map(attendee => eventRegistrationsSchema.parse(attendee))
}
