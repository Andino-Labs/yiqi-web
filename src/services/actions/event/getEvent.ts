'use server'

import { SavedEventType } from '@/schemas/eventSchema'
import prisma from '@/lib/prisma'
import { SavedEventSchema } from '@/schemas/eventSchema'

export async function getEvent(
  eventId: string,
  includeTickets = false
): Promise<SavedEventType> {
  const event = await prisma.event.findUniqueOrThrow({
    where: { id: eventId },
    include: includeTickets ? { tickets: true } : undefined
  })

  return SavedEventSchema.parse(event)
}
