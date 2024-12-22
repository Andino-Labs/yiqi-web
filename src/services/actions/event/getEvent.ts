'use server'

import prisma from '@/lib/prisma'
import { NewEventSchema } from '@/schemas/eventSchema'

export async function getEvent({
  eventId,
  includeTickets
}: {
  eventId: string
  includeTickets?: boolean
}) {
  const event = await prisma.event.findUniqueOrThrow({
    where: { id: eventId },
    include: { tickets: includeTickets || false }
  })

  const formattedEvent = {
    ...event,
    tickets: event.tickets?.map(ticket => ({
      ...ticket,
      price: ticket.price.toNumber() // Convert Decimal to number
    }))
  }

  return NewEventSchema.parse(formattedEvent)
}

export type EventType = Awaited<ReturnType<typeof getEvent>>
