'use server'
import prisma from '@/lib/prisma'
import {
  InvoiceEmailTemplateProps,
  InvoiceItem
} from '@/lib/email/templates/invoiceTemplate'

export async function getInvoiceData(
  userId: string,
  eventId: string,
  invoiceNumber: string
): Promise<InvoiceEmailTemplateProps> {
  try {
    const res = await prisma.eventRegistration.findFirst({
      where: {
        userId: userId,
        eventId: eventId
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        event: {
          select: {
            id: true,
            title: true,
            startDate: true,
            endDate: true
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
    })

    if (!res) {
      throw new Error('Event registration not found')
    }

    const items: InvoiceEmailTemplateProps['items'] = res.tickets.map(
      function (ticket) {
        return {
          description: ticket.ticketType.name,
          amount: Number(ticket.ticketType.price)
        }
      }
    )

    const amount: number = items.reduce(function (
      sum: number,
      item: InvoiceItem
    ) {
      return sum + item.amount
    }, 0)

    const invoiceData: InvoiceEmailTemplateProps = {
      user: res.user,
      event: res.event,
      amount: amount,
      invoiceNumber: invoiceNumber,
      items: items
    }

    return invoiceData
  } catch (error) {
    console.error('Error fetching invoice data:', error)
    throw error
  }
}
