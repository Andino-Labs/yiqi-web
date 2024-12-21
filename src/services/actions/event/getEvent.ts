'use server'

import prisma from '@/lib/prisma'
import { GetEventFilterSchemaType } from '@/schemas/eventSchema'
import { SavedEventSchema } from '@/schemas/eventSchema'

export async function getEvent({
  eventId,
  includeTickets
}: GetEventFilterSchemaType) {
  const event = await prisma.event.findUniqueOrThrow({
    where: { id: eventId },
    include: { tickets: includeTickets || false }
  })

  return SavedEventSchema.parse(event)
}

export type EventType = Awaited<ReturnType<typeof getEvent>>
