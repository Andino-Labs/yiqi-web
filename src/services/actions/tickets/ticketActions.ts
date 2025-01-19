'use server'

import prisma from '@/lib/prisma'
import { ticketEventSchema } from '@/schemas/ticketSchema'

export async function getTicketsWithEvents(userId: string) {
  const events = await prisma.event.findMany({
    where: {
      deletedAt: null,
      tickets: {
        some: {
          Ticket: {
            some: {
              userId
            }
          }
        }
      }
    },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          logo: true
        }
      },
      tickets: {
        where: {
          Ticket: {
            some: {
              userId
            }
          }
        },
        include: {
          Ticket: {
            where: {
              userId
            },
            include: {
              registration: true
            }
          }
        }
      }
    },
    orderBy: {
      startDate: 'desc'
    }
  })

  const ticketsWithEvents = events.map(event => {
    const eventTickets = event.tickets.flatMap(ticketType =>
      ticketType.Ticket.map(ticket => ({
        id: ticket.id,
        description: ticketType.description,
        registrationId: ticket.registrationId,
        userId: ticket.userId,
        checkedInDate: ticket.checkedInDate,
        checkedInByUserId: ticket.checkedInByUserId,
        category: ticketType.category,
        ticketTypeId: ticketType.id,
        registration: ticket.registration,
        status: ticket.registration?.status || 'PENDING'
      }))
    )

    return {
      event: {
        id: event.id,
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        openGraphImage: event.openGraphImage || '',
        type: event.type === 'IN_PERSON' ? 'IN_PERSON' : 'VIRTUAL',
        organizationId: event.organizationId,
        organization: {
          id: event.organization.id,
          name: event.organization.name,
          logo: event.organization.logo || ''
        }
      },
      tickets: eventTickets
    }
  })
  return ticketEventSchema.parse(ticketsWithEvents)
}
