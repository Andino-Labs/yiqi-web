import createMessageRecord from '@/lib/communications/createMessageRecord'
import prisma from '@/lib/prisma'
import { MessageThreadType } from '@prisma/client'

export type HandleEmailReceivedType = {
  fromEmail: string
  toEmail: string
  content: string
  subject: string
}

export async function handleEmailReceived({
  fromEmail,
  toEmail,
  content
}: HandleEmailReceivedType) {
  // Find the sender user
  const fromUser = await prisma.user.findFirst({
    where: {
      email: fromEmail
    }
  })

  if (!fromUser) {
    throw new Error('Sender user not found')
  }

  // Extract orgId from the yiqi.lat email address
  const orgId = toEmail.split('@')[0]

  // Find the organization
  const organization = await prisma.organization.findFirst({
    where: {
      id: orgId
    }
  })

  if (!organization) {
    throw new Error('Organization not found')
  }

  // Find or create the message thread
  let thread = await prisma.messageThread.findFirst({
    where: {
      organizationId: organization.id,
      type: MessageThreadType.email,
      contextUserId: fromUser.id
    }
  })

  if (!thread) {
    thread = await prisma.messageThread.create({
      data: {
        organizationId: organization.id,
        type: MessageThreadType.email,
        contextUserId: fromUser.id
      }
    })
  }

  // Create the message record with all required fields
  return createMessageRecord({
    content,
    messageThreadId: thread.id,
    senderUserId: fromUser.id,
    destinationUserId: null // Since this is an inbound message, there's no specific destination user
  })
}
