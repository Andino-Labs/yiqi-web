'use server'

import prisma from '../prisma'
import { sendUserCommunicationsForServer } from '@/services/actions/communications/sendUserCommunicationsForServer'
import { handleNotificationJob } from '@/services/notifications/handlers'
import { SendBaseMessageToUserPropsSchema } from '@/services/notifications/sendBaseMessageToUser'
import { JobType, type QueueJob } from '@prisma/client'
import { processUserFirstPartyData } from '../data/processors/processUserFirstPartyData'
import { processUserMatches } from '../data/processors/processUserMatches'

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
  },
  [JobType.MATCH_MAKING_GENERATION]: async job => {
    if (!job.userId || !job.eventId) {
      throw new Error('MATCH MAKING GENERATION job requires userId and eventId')
    }

    await processUserMatches(job.userId, job.eventId)
  }
}

export async function processQueueJobs() {
  const jobs = await prisma.queueJob.findMany({
    where: {
      status: 'PENDING',
      attempts: { lt: 3 }
    },
    orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
    take: 10, // Process 10 jobs at a time
    include: { user: true } // Include related user data if needed
  })

  const results = await Promise.all(
    jobs.map(async job => {
      try {
        // Update job to PROCESSING
        await prisma.queueJob.update({
          where: { id: job.id },
          data: {
            status: 'PROCESSING',
            startedAt: new Date(),
            attempts: { increment: 1 }
          }
        })

        const handler = jobHandlers[job.type]
        if (!handler) {
          throw new Error(`Unsupported job type: ${job.type}`)
        }

        await handler(job)

        // Update job to COMPLETED
        await prisma.queueJob.update({
          where: { id: job.id },
          data: {
            status: 'COMPLETED',
            completedAt: new Date()
          }
        })

        return { jobId: job.id, status: 'COMPLETED' as const }
      } catch (error) {
        console.error(`Error processing job ${job.id}:`, error)

        const newStatus =
          job.attempts + 1 >= job.maxAttempts ? 'FAILED' : 'PENDING'

        // Update job to FAILED or back to PENDING
        await prisma.queueJob.update({
          where: { id: job.id },
          data: {
            status: newStatus,
            failedAt: newStatus === 'FAILED' ? new Date() : null,
            error: (error as Error).message
          }
        })

        return {
          jobId: job.id,
          status: newStatus as 'FAILED' | 'PENDING',
          error: (error as Error).message
        }
      }
    })
  )

  return results
}
