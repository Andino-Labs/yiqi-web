'use server'

import { JobType } from '@prisma/client'
import prisma from '../prisma'
import { jobHandlers } from './common'

// due to rate limits we need to process these jobs one at a time.
export async function processQueueJobsHeavy() {
  console.log('processing heavy jobs')
  const jobs = await prisma.queueJob.findMany({
    where: {
      status: 'PENDING',
      attempts: { lt: 3 },
      type: {
        in: [JobType.MATCH_MAKING_GENERATION, JobType.PROCESS_USER_DATA]
      }
    },
    orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
    take: 3, // Process 10 jobs at a time
    include: { user: true } // Include related user data if needed
  })

  console.log('found jobs', jobs.length)

  for (const job of jobs) {
    try {
      console.log('job starting ', job.id)
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

      console.log('job running for email', job.user?.email)

      await handler(job)

      // Update job to COMPLETED
      await prisma.queueJob.update({
        where: { id: job.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date()
        }
      })
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
    }
  }
}
