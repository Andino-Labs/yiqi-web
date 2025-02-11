'use server'

import prisma from '@/lib/prisma'
import { AttendeeStatus } from '@prisma/client'

export const updateAttendeeTicketsByStatus = async (
  eventId: string,
  userId: string,
  attendeeStatus: AttendeeStatus
) => {
  const ticketOfferings = await prisma.ticketOfferings.findMany({
    where: { eventId },
    select: { id: true }
  })

  await prisma.ticket.updateMany({
    where: {
      AND: [
        { userId },
        { ticketTypeId: { in: ticketOfferings.map(_ => _.id) } }
      ]
    },
    data: { deletedAt: attendeeStatus === 'APPROVED' ? null : new Date() }
  })
}
