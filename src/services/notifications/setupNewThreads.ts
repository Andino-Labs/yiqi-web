'use server'

import prisma from '@/lib/prisma'
import { MessageThreadType } from '@prisma/client'
export default async function setupNewThreads(
  userId: string,
  organizationId: string
) {
  // Check if email thread already exists for the user in the organization
  const threads = await prisma.messageThread.findMany({
    where: {
      organizationId,
      contextUserId: userId
    }
  })

  const emailThread = threads?.find(thread => thread.type === 'email')
  const whatsappThread = threads?.find(thread => thread.type === 'whatsapp')

  const threadsToCreate = []
  // If email thread doesn't exist, create a new one
  if (!emailThread) {
    threadsToCreate.push({
      organizationId,
      contextUserId: userId,
      type: MessageThreadType.email
    })
  }

  // If WhatsApp thread doesn't exist, create a new one
  if (!whatsappThread) {
    threadsToCreate.push({
      organizationId,
      contextUserId: userId,
      type: MessageThreadType.whatsapp
    })
  }
  if (threadsToCreate.length > 0) {
    await prisma.messageThread.createMany({
      data: threadsToCreate
    })
  }
}
