// 'use server'

// import prisma from '@/lib/prisma'
// import { SavedEventSchema } from '@/schemas/eventSchema'

// export async function getEvent({
//   eventId,
//   includeTickets
// }: {
//   eventId: string
//   includeTickets?: boolean
// }) {
//   const event = await prisma.event.findUniqueOrThrow({
//     where: { id: eventId },
//     include: { tickets: includeTickets || false }
//   })

//   const formattedEvent = {
//     ...event,
//     tickets: event.tickets?.map(ticket => ({
//       ...ticket,
//       price: ticket.price.toNumber() // Convert Decimal to number
//     }))
//   }

//   return SavedEventSchema.parse(formattedEvent)
// }

// export type EventType = Awaited<ReturnType<typeof getEvent>>

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
