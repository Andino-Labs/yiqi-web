import prisma from '../prisma'
import { processUserFirstPartyData } from '../data/processors/processUserFirstPartyData'
import { CollectUserDataJobSchema } from '@/schemas/cronSchemas'

export async function dataCollectorsCron() {
  // Find jobs that need to be processed
  const jobs = await prisma.queueJob.findMany({
    where: {
      type: 'COLLECT_USER_DATA',
      status: 'PENDING',
      attempts: { lt: 3 }
    },
    orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
    take: 5
  })

  return await Promise.all(
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

        // Process the job
        const { userId } = CollectUserDataJobSchema.parse(job.data)

        await processUserFirstPartyData(userId)

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
}
