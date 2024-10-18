import prisma from '@/lib/prisma'
import {
  generateEmailPlainText,
  MailTemplatesIds,
  sendEmailForTemplate,
  TemplatePropsMap
} from '../lib'
import createMessageRecord from '@/lib/communications/createMessageRecord'

// Define the input type that enforces correct template-data pairing
export type SendEmailToUserType<T extends MailTemplatesIds> = {
  templateId: T
  subject: string
  dynamicTemplateData: TemplatePropsMap[T]
  destinationUserId: string
  threadId: string
  content?: string | undefined
  attachement?: string
  senderUserId?: string
}

export async function sendEmailToUser<T extends MailTemplatesIds>({
  destinationUserId,
  threadId,
  content,
  attachement,
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
      organization: {}
    }
  })

  const user = thread.contextUser

  if (!user.email) {
    throw ' user doesnt have an email'
  }

  await sendEmailForTemplate({
    ...sendMailInput,
    toEmail: user.email,
    threadId
  })

  const textContent = await generateEmailPlainText({ ...sendMailInput })

  return createMessageRecord({
    content: content || textContent,
    attachement,
    destinationUserId,
    messageThreadId: thread.id,
    senderUserId
  })
}
