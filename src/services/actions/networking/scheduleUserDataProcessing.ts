'use server'

import prisma from '@/lib/prisma'
import { JobType, JobStatus } from '@prisma/client'

export async function scheduleUserDataProcessing(
  userId: string
): Promise<void> {
  if (!userId) {
    throw new Error('userId is required')
  }
  try {
    await prisma.queueJob.create({
      data: {
        type: JobType.PROCESS_USER_DATA,
        status: JobStatus.PENDING,
        data: {
          userId
        },
        priority: 0,
        userId
      }
    })

    console.log(`Scheduled PROCESS_USER_DATA job for user ${userId}`)
  } catch (error) {
    throw new Error(`${error}`)
  }
}
