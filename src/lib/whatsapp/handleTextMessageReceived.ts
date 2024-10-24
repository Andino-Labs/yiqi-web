import { TextMessagePayload } from '@/schemas/whatsappSchema'
import prisma from '../prisma'

export async function handleTextMessageReceived(payload: TextMessagePayload) {
  const entry = payload.entry[0]
  const message = entry.changes[0].value.messages[0]

  const integration = await prisma.whatsappIntegration.findFirstOrThrow({
    where: {
      businessAccountId: entry.id
    },
    include: {
      integration: { include: { organization: true } }
    }
  })

  const fromUser = await prisma.user.findFirstOrThrow({
    where: {
      phoneNumber: message.from
    }
  })

  const organization = integration.integration.organization
  const thread = await prisma.messageThread.findFirstOrThrow({
    where: {
      organizationId: organization.id,
      type: 'whatsapp',
      contextUserId: fromUser.id
    }
  })

  await prisma.message.create({
    data: {
      content: message.text.body,
      senderUserId: fromUser.id,
      messageThreadId: thread.id
    }
  })
}
