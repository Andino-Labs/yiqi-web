import { sendEmailToUser } from '@/lib/email/handlers/sendEmailToUser'
import { MailTemplatesIds } from '@/lib/email/lib'
import prisma from '@/lib/prisma'
import { sendUserWhatsappMessage } from '@/lib/whatsapp/sendUserWhatsappMessage'
import { Event, Organization } from '@prisma/client'
import { User } from 'lucia'

export default async function sendPaymentReminder({
  event,
  org,
  user
}: {
  user: User
  event: Event
  org: Organization
}) {
  const realUser = await prisma.user.findFirstOrThrow({
    where: { id: user.id }
  })
  // TODO: send the messages and template stuff
  // send both the whatsapp and the email here, also include the initial
  // const message = `Reminder for ${user.name}: Event "${event.title}" starts on ${event.startDate}`;

  const threads = await prisma.messageThread.findMany({
    where: {
      organizationId: org.id,
      contextUserId: user.id
    }
  })

  const results = threads.map(async thread => {
    const threadType = thread.type

    if (threadType === 'email') {
      sendEmailToUser({
        destinationUserId: user.id,
        threadId: thread.id,
        // todo modify the type for the one u need.
        dynamicTemplateData: { event, user: realUser },

        subject: 'You can still get your tickets.',
        // TODO change this to something meaninfull like payment reminder
        templateId: MailTemplatesIds.RESERVATION_PAYMENT_REMINDER
      })
    }
    if (threadType === 'whatsapp') {
      sendUserWhatsappMessage({
        destinationUserId: user.id,
        threadId: thread.id,
        content: ''
      })
    }
  })

  await Promise.allSettled(results)
}
