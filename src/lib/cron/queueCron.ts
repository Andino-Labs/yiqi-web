'use server'
import prisma from '../prisma'
import { sendUserCommunicationsForServer } from '@/services/actions/communications/sendUserCommunicationsForServer'
import { handleNotificationJob } from '@/services/notifications/handlers'
import { SendBaseMessageToUserPropsSchema } from '@/services/notifications/sendBaseMessageToUser'

export async function processQueueJobs() {
  // Find jobs that need to be processed
  const jobs = await prisma.queueJob.findMany({
    where: {
      status: 'PENDING',
      attempts: { lt: 3 }
    },
    orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
    take: 10 // Process 10 jobs at a time
  })

  const results = await Promise.all(
    jobs.map(async job => {
      try {
        // Update job status to PROCESSING
        await prisma.queueJob.update({
          where: { id: job.id },
          data: {
            status: 'PROCESSING',
            startedAt: new Date(),
            attempts: { increment: 1 }
          }
        })

        // Process the job based on its type
        switch (job.type) {
          case 'SEND_USER_MESSAGE': {
            // notifications are messages that are sent to users that are automated
            if (job.notificationType) {
              await handleNotificationJob(job)
              break
            }

            // regular messages are messages that are sent to users that are not automated
            const data = SendBaseMessageToUserPropsSchema.parse(job.data)
            await sendUserCommunicationsForServer(data)
            break
          }
          // Add other job types here
          default:
            throw new Error(`Unsupported job type: ${job.type}`)
        }

        // Update job status to COMPLETED
        await prisma.queueJob.update({
          where: { id: job.id },
          data: { status: 'COMPLETED', completedAt: new Date() }
        })

        return { jobId: job.id, status: 'COMPLETED' }
      } catch (error) {
        console.error(`Error processing job ${job.id}:`, error)

        // Update job status to FAILED or back to PENDING if attempts < maxAttempts
        const updatedJob = await prisma.queueJob.update({
          where: { id: job.id },
          data: {
            status: job.attempts + 1 >= job.maxAttempts ? 'FAILED' : 'PENDING',
            failedAt: job.attempts + 1 >= job.maxAttempts ? new Date() : null,
            error: (error as Error).message
          }
        })

        return {
          jobId: job.id,
          status: updatedJob.status,
          error: (error as Error).message
        }
      }
    })
  )
  return results
}
