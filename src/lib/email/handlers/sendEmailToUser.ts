import prisma from '@/lib/prisma'
import {
  generateEmailPlainText,
  MailTemplatesIds,
  sendEmailForTemplate,
  TemplatePropsMap
} from '../lib'
import createMessageRecord from '@/lib/communications/createMessageRecord'
import { CreateEmailOptions } from 'resend'

// Define the input type that enforces correct template-data pairing
export type SendEmailToUserType<T extends MailTemplatesIds> = {
  templateId: T
  subject: string
  dynamicTemplateData: TemplatePropsMap[T]
  destinationUserId: string
  threadId: string
  content?: string | undefined
  senderUserId?: string
  attachments?: CreateEmailOptions['attachments']
}

export async function sendEmailToUser<T extends MailTemplatesIds>({
  destinationUserId,
  threadId,
  content,
  senderUserId,
  ...sendMailInput
}: SendEmailToUserType<T>) {
  // get users whatsapp
  const thread = await prisma.messageThread.findFirstOrThrow({
    where: {
      id: threadId
    },
    include: {
      contextUser: true,
      organization: { select: { id: true, name: true } }
    }
  })

  const user = thread.contextUser

  if (!user.email) {
    throw ' user doesnt have an email'
  }

  await sendEmailForTemplate({
    ...sendMailInput,
    toEmail: user.email,
    threadId,
    fromEmail: `${thread.organization.name} - Yiqi mail <${thread.organization.id}@yiqi.lat>`
  })

  const textContent = await generateEmailPlainText({ ...sendMailInput })

  return createMessageRecord({
    content: content || textContent,
    destinationUserId,
    messageThreadId: thread.id,
    senderUserId
  })
}
