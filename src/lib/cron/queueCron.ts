'use server'

import prisma from '../prisma'
import { sendUserCommunicationsForServer } from '@/services/actions/communications/sendUserCommunicationsForServer'
import { handleNotificationJob } from '@/services/notifications/handlers'
import { SendBaseMessageToUserPropsSchema } from '@/services/notifications/sendBaseMessageToUser'
import { JobType } from '@prisma/client'
import { QueueJob } from '@prisma/client'
import { processUserFirstPartyData } from '../data/processors/processUserFirstPartyData'

type JobHandler = (job: QueueJob) => Promise<void>

const jobHandlers: Record<JobType, JobHandler> = {
  [JobType.SEND_USER_MESSAGE]: async job => {
    if (job.notificationType) {
      await handleNotificationJob(job)
    } else {
      const data = SendBaseMessageToUserPropsSchema.parse(job.data)
      await sendUserCommunicationsForServer(data)
    }
  },
  [JobType.PROCESS_USER_DATA]: async job => {
    if (!job.userId) {
      throw new Error(`No userId found, user id related ${job.userId}`)
    }
    await processUserFirstPartyData(job.userId)
  },
  [JobType.GENERATE_EVENT_OPEN_GRAPH]: async job => {
    console.log('GENERATE EVENT OPEN GRAPH was run, left to implement', job)
  },
  [JobType.COLLECT_USER_DATA]: async job => {
    console.log('COLLECT USER DATA was run, left to implement', job)
  }
}

export async function processQueueJobs() {
  const results = await prisma.$transaction(async tx => {
    // Find jobs that need to be processed
    const jobs = await tx.queueJob.findMany({
      where: {
        status: 'PENDING',
        attempts: { lt: 3 }
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
      take: 10, // Process 10 jobs at a time
      include: { user: true } // Include related user data if needed
    })

    // Update all jobs to PROCESSING status in one query
    await tx.queueJob.updateMany({
      where: { id: { in: jobs.map(job => job.id) } },
      data: {
        status: 'PROCESSING',
        startedAt: new Date(),
        attempts: { increment: 1 }
      }
    })

    const processedJobs = await Promise.all(
      jobs.map(async job => {
        try {
          const handler = jobHandlers[job.type]
          if (!handler) {
            throw new Error(`Unsupported job type: ${job.type}`)
          }
          await handler(job)

          return { jobId: job.id, status: 'COMPLETED' as const }
        } catch (error) {
          console.error(`Error processing job ${job.id}:`, error)
          return {
            jobId: job.id,
            status:
              job.attempts + 1 >= job.maxAttempts
                ? ('FAILED' as const)
                : ('PENDING' as const),
            error: (error as Error).message
          }
        }
      })
    )

    // Bulk update completed jobs
    const completedJobIds = processedJobs
      .filter(job => job.status === 'COMPLETED')
      .map(job => job.jobId)
    if (completedJobIds.length > 0) {
      await tx.queueJob.updateMany({
        where: { id: { in: completedJobIds } },
        data: { status: 'COMPLETED', completedAt: new Date() }
      })
    }

    // Bulk update failed/pending jobs
    const failedOrPendingJobs = processedJobs.filter(
      job => job.status !== 'COMPLETED'
    )
    for (const job of failedOrPendingJobs) {
      await tx.queueJob.update({
        where: { id: job.jobId },
        data: {
          status: job.status,
          failedAt: job.status === 'FAILED' ? new Date() : null,
          error: job.error
        }
      })
    }

    return processedJobs
  })

  return results
}
