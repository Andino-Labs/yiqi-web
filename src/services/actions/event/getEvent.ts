'use server'

import { SavedEventType } from '@/schemas/eventSchema'
import prisma from '@/lib/prisma'
import {
  SavedEventSchema,
  GetEventFilterSchemaType
} from '@/schemas/eventSchema'

export async function getEvent({
  eventId,
  includeTickets
}: GetEventFilterSchemaType): Promise<SavedEventType> {
  const event = await prisma.event.findUniqueOrThrow({
    where: { id: eventId },
    include: includeTickets ? { tickets: true } : undefined
  })

  return SavedEventSchema.parse(event)
}
