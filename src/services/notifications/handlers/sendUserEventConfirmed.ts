import { generateCalendarEvent } from '@/lib/calendar'
import { sendEmailToUser } from '@/lib/email/handlers/sendEmailToUser'
import { MailTemplatesIds } from '@/lib/email/lib'
import prisma from '@/lib/prisma'
import { sendUserWhatsappMessage } from '@/lib/whatsapp/sendUserWhatsappMessage'
import { MessageThreadTypeEnum, MessageSchema } from '@/schemas/messagesSchema'
import { QueueJob } from '@prisma/client'

export async function sendUserEventConfirmed(props: QueueJob) {
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
      content: `Confirmación de reserva para ${event.title} de ${event.organization.name}`,
      threadId: thread.id
    })
    return MessageSchema.parse(result)
  } else if (thread.type === MessageThreadTypeEnum.Enum.email) {
    const calendarEvent = await generateCalendarEvent({
      start: event.startDate,
      end: event.endDate,
      title: event.title,
      description: event.description ?? '',
      location: event.location ?? undefined
    })
    await sendEmailToUser({
      templateId: MailTemplatesIds.RESERVATION_CONFIRMED,
      dynamicTemplateData: { user, event },
      destinationUserId: user.id,
      threadId: thread.id,
      subject: `Confirmación de reserva para ${event.title} de ${event.organization.name}`,
      attachments: [
        {
          filename: 'event.ics',
          content: calendarEvent,
          contentType: 'text/calendar; method=REQUEST'
        }
      ]
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
