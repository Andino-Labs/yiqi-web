import { sendEmailToUser } from '@/lib/email/handlers/sendEmailToUser'
import { MailTemplatesIds } from '@/lib/email/lib'
import prisma from '@/lib/prisma'
import { sendUserWhatsappMessage } from '@/lib/whatsapp/sendUserWhatsappMessage'
import { MessageSchema, MessageThreadTypeEnum } from '@/schemas/messagesSchema'
import { QueueJob } from '@prisma/client'

async function getInvoiceData(userId: string, eventId: string) {
  try {
    const result = await prisma.$transaction(async prisma => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true
        }
      })

      const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: {
          id: true,
          title: true,
          startDate: true,
          endDate: true
        }
      })

      const tickets = await prisma.ticket.findMany({
        where: {
          userId: userId,
          registration: {
            eventId: eventId
          }
        },
        select: {
          ticketType: {
            select: {
              name: true,
              price: true
            }
          }
        }
      })

      if (!user || !event || tickets.length === 0) {
        throw new Error('User, event, or tickets not found')
      }

      const items = tickets.map(function (ticket) {
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
        event: event,
        amount: amount,
        items: items
      }
    })

    return result
  } catch (error) {
    console.error('Error fetching invoice data:', error)
    throw error
  }
}

export async function sendUserPaymentConfirmed(props: QueueJob) {
  const jobdata = await prisma.queueJob.findUniqueOrThrow({
    where: {
      id: props.id
    },
    include: {
      user: true,
      event: { include: { organization: true } }
    }
  })

  const { event, user } = jobdata
  if (!user || !event) {
    throw new Error('User or event not found for job', {
      cause: jobdata
    })
  }
  const thread = await prisma.messageThread.findFirst({
    where: {
      contextUserId: user.id,
      type: MessageThreadTypeEnum.Enum.email,
      organizationId: event.organizationId
    }
  })

  if (!thread) {
    throw new Error('Thread not found')
  }

  if (thread.type === MessageThreadTypeEnum.Enum.whatsapp) {
    const result = await sendUserWhatsappMessage({
      destinationUserId: user.id,
      content: `compraste tu ticket para ${event.title} de ${event.organization.name}`,
      threadId: thread.id
    })
    return MessageSchema.parse(result)
  } else if (thread.type === MessageThreadTypeEnum.Enum.email) {
    const invoice = await getInvoiceData(user.id, event.id)
    await sendEmailToUser({
      templateId: MailTemplatesIds.PAYMENT_CONFIRMED,
      dynamicTemplateData: {
        event,
        user,
        items: invoice.items,
        amount: invoice.amount,
        invoiceNumber: `21211212-${event.id}-${user.id}`
      },
      destinationUserId: user.id,
      threadId: thread.id,
      subject: `Compraste entradas para ${event.title} de ${event.organization.name}`
    })

    const latestData = await prisma.message.findFirstOrThrow({
      where: {
        messageThreadId: thread.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        senderUser: {
          select: { id: true, name: true, picture: true }
        },
        destinationUser: {
          select: { id: true, name: true, picture: true }
        },
        messageThread: {
          select: {
            type: true,
            id: true
          }
        }
      }
    })
    return MessageSchema.parse(latestData)
  }

  throw new Error('Invalid message type')
}
