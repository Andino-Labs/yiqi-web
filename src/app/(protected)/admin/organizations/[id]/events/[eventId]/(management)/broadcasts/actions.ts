'use server'
import prisma from '@/lib/prisma'
import { JobType, MessageThreadType } from '@prisma/client'

export const notifyAudience = async (
  userIds: string[],
  bodyMessage: string,
  organizationId: string
) => {
  const dataToTake = userIds.map(id => ({
    userId: id,
    organizationId,
    type: JobType.SEND_USER_MESSAGE,
    data: {
      orgId: organizationId,
      messageType: MessageThreadType.email,
      destinationUserId: id,
      content: bodyMessage
    }
  }))

  const notifications = await prisma.queueJob.createMany({
    data: dataToTake
  })

  console.warn(notifications)
  return { sucess: true }
}
