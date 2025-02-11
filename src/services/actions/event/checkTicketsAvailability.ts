'use server'

import prisma from '@/lib/prisma'

export async function checkTicketsAvailability(
  ticketOfferingsIds: string[]
): Promise<Record<string, number>> {
  const ticketsData = await prisma.ticketOfferings.findMany({
    where: { id: { in: ticketOfferingsIds } }
  })

  const countPromises = ticketsData.map(async v => {
    const numberOfExistingTickets = await prisma.ticket.count({
      where: {
        AND: [{ ticketTypeId: v.id }, { deletedAt: null }]
      }
    })

    return {
      ticketOfferingId: v.id,
      availableForPurchase: v.limit - numberOfExistingTickets
    }
  })

  const results = await Promise.all(countPromises)

  return results.reduce(
    (acc, v) => {
      acc[v.ticketOfferingId] = v.availableForPurchase
      return acc
    },
    {} as Record<string, number>
  )
}
