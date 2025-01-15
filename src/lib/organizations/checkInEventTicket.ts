import { getEvent } from '@/services/actions/event/getEvent'
import { isOrganizerAdmin } from '@/lib/auth/lucia'

import prisma from '@/lib/prisma'
import { TicketSchema } from '@/schemas/eventSchema'

export async function checkInEventTicket(
  eventId: string,
  ticketId: string,
  currentUserId: string
) {
  const event = await getEvent({ eventId })
  if (!event) throw new Error('Event not found')

  if (
    !currentUserId ||
    !(await isOrganizerAdmin(event.organizationId, currentUserId))
  ) {
    throw new Error('Unauthorized')
  }

  const updatedRegistration = await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      checkedInByUserId: currentUserId,
      checkedInDate: new Date()
    },
    include: {
      user: true
    }
  })

  return TicketSchema.parse(updatedRegistration)
}
