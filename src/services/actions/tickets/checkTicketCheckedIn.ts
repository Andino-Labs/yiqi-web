'use server'

import prisma from '@/lib/prisma'

export async function checkTicketCheckedIn(ticketId: string) {
  if (!ticketId) {
    throw new Error('Ticket ID is required')
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: { checkedInDate: true }
  })

  return { checkedInDate: ticket?.checkedInDate || null }
}
