import createMessageRecord from '@/lib/communications/createMessageRecord'
import prisma from '@/lib/prisma'

export type HandleEmailReceivedType = {
  threadId: string
  content: string
  attachement?: string
}

export async function handleEmailReceived({
  threadId,
  content,
  attachement
}: HandleEmailReceivedType) {
  // get users whatsapp
  const thread = await prisma.messageThread.findFirstOrThrow({
    where: {
      id: threadId
    },
    include: {
      contextUser: true
    }
  })
  // eventId

  const user = thread.contextUser

  if (!user.email) {
    throw ' user doesnt have an email'
  }

  return createMessageRecord({
    content,
    attachement,
    messageThreadId: thread.id,
    senderUserId: user.id
  })
}
