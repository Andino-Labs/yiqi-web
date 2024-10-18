import { sendEmailToUser } from '@/lib/email/handlers/sendMessageToUser'
import { MailTemplatesIds } from '@/lib/email/lib'
import prisma from '@/lib/prisma'
import { sendUserWhatsappMessage } from '@/lib/whatsapp'
import { MessageSchema, MessageThreadTypeEnum } from '@/schemas/messagesSchema'

import { z } from 'zod'

export const SendBaseMessageToUserPropsSchema = z.object({
  destinationUserId: z.string(),
  content: z.string(),
  messageType: z.nativeEnum(MessageThreadTypeEnum.Enum),
  orgId: z.string()
})

export type SendBaseMessageToUserProps = z.infer<
  typeof SendBaseMessageToUserPropsSchema
>

export async function sendBaseMessageToUser({
  destinationUserId,
  content,
  messageType,
  orgId
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
    const result = await sendEmailToUser({
      templateId: MailTemplatesIds.BASE_EMAIL_TEMPLATE,
      dynamicTemplateData: {
        content: content
      },
      destinationUserId: destinationUserId,
      threadId: thread.id,
      subject: 'Mensaje de la plataforma'
    })
    return MessageSchema.parse(result)
  }

  throw new Error('Invalid message type')
}
