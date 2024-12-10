import { sendEmailToUser } from '@/lib/email/handlers/sendEmailToUser'
import { MailTemplatesIds } from '@/lib/email/lib'
import prisma from '@/lib/prisma'
import { sendUserWhatsappMessage } from '@/lib/whatsapp/sendUserWhatsappMessage'
import { MessageSchema, MessageThreadTypeEnum } from '@/schemas/messagesSchema'

import { z } from 'zod'

export const SendBaseMessageToUserPropsSchema = z.object({
  destinationUserId: z.string(),
  content: z.string(),
  messageType: z.nativeEnum(MessageThreadTypeEnum.Enum),
  orgId: z.string(),
  senderUserId: z.string().optional()
})

export type SendBaseMessageToUserProps = z.infer<
  typeof SendBaseMessageToUserPropsSchema
>

export async function sendBaseMessageToUser({
  destinationUserId,
  content,
  messageType,
  orgId,
  senderUserId
}: SendBaseMessageToUserProps) {
  const thread = await prisma.messageThread.findFirst({
    where: {
      contextUserId: destinationUserId,
      type: messageType,
      organizationId: orgId
    }
  })

  if (!thread) {
    throw new Error('Thread not found')
  }

  if (thread.type === MessageThreadTypeEnum.Enum.whatsapp) {
    const result = await sendUserWhatsappMessage({
      destinationUserId: destinationUserId,
      content: content,
      threadId: thread.id
    })
    return MessageSchema.parse(result)
  } else if (thread.type === MessageThreadTypeEnum.Enum.email) {
    await sendEmailToUser({
      templateId: MailTemplatesIds.BASE_EMAIL_TEMPLATE,
      dynamicTemplateData: {
        content: content
      },
      destinationUserId: destinationUserId,
      threadId: thread.id,
      subject: 'Mensaje de la plataforma',
      senderUserId: senderUserId
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
