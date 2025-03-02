'use server'

import prisma from '@/lib/prisma'
import {
  EventRegistrationsSchemaType,
  eventRegistrationStatusSchema,
  eventTicketTypeSchema
} from '@/schemas/eventSchema'
import { userSchema } from '@/schemas/userSchema'

export async function getEventRegistrations(
  eventId: string
): Promise<EventRegistrationsSchemaType[]> {
  const attendees = await prisma.eventRegistration.findMany({
    where: { eventId },
    include: {
      user: true,
      tickets: {
        include: {
          ticketType: true
        }
      }
    }
  })

  return attendees.map(attendee => {
    const user = userSchema.parse(attendee.user)
    return {
      id: attendee.id,
      status: eventRegistrationStatusSchema.parse(attendee.status),
      createdAt: attendee.createdAt,
      updatedAt: attendee.updatedAt,
      paid: attendee.paid,
      user,
      tickets: attendee.tickets.map(ticket => ({
        id: ticket.id,
        price: ticket.ticketType.price.toNumber(),
        name: ticket.ticketType.name,
        type: eventTicketTypeSchema.parse(ticket.ticketType.category)
      })),
      customFields: attendee.customFields,
      paymentId: attendee.paymentId
    }
  })
}
// id: z.string(),
//   user: userSchema,
//   status: eventRegistrationStatusSchema,
//   createdAt: z.date(),
//   updatedAt: z.date(),
//   paid: z.boolean(),
//   paymentId: z.string().optional().nullable(),
//   customFields: z.any().optional().nullable(),
//   tickets: z.object({
//     id: z.string(),
//     price: z.coerce.number(),
//     name: z.string(),
//     type: eventTicketTypeSchema
//   })
