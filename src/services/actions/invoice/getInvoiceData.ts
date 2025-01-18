import prisma from '@/lib/prisma'

export async function getInvoiceData(userId: string, eventId: string) {
  try {
    const result = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        registrations: {
          where: { userId: userId },
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            tickets: {
              select: {
                ticketType: {
                  select: {
                    name: true,
                    price: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!result || result.registrations.length === 0) {
      throw new Error('Event, user, or tickets not found')
    }

    const registration = result.registrations[0]
    const user = registration.user
    const items = registration.tickets.map(function (ticket) {
      return {
        description: ticket.ticketType.name,
        amount: Number(ticket.ticketType.price)
      }
    })

    const amount = items.reduce(function (sum, item) {
      return sum + item.amount
    }, 0)

    return {
      user: user,
      event: {
        id: result.id,
        title: result.title,
        startDate: result.startDate,
        endDate: result.endDate
      },
      amount: amount,
      items: items
    }
  } catch (error) {
    console.error('Error fetching invoice data:', error)
    throw error
  }
}
