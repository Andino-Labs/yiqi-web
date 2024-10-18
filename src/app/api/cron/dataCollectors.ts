// a new cron job that will collect data from the internet
// and store it in the database

import prisma from '@/lib/prisma'
import { getLinkedInData } from '@/services/data/collectLinkedinUserProfile'
// import { getTwitterData } from "@/services/data/collectTwitterUserProfile";
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
const CollectUserDataJobSchema = z.object({
  userId: z.string(),
  platforms: z.array(z.enum(['linkedin', 'twitter']))
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Find jobs that need to be processed
  const jobs = await prisma.queueJob.findMany({
    where: {
      type: 'COLLECT_USER_DATA',
      status: 'PENDING',
      attempts: { lt: 3 } // Only get jobs that have been attempted less than 3 times
    },
    orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
    take: 5
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

        // Process the job
        const { userId, platforms } = CollectUserDataJobSchema.parse(job.data)
        const collectedData: Record<string, unknown> = {}

        for (const platform of platforms) {
          if (platform === 'linkedin') {
            collectedData.linkedin = await getLinkedInData(userId)
          } else if (platform === 'twitter') {
            // collectedData.twitter = await getTwitterData(userId);
          }
        }

        // Update user with collected data
        await prisma.user.update({
          where: { id: userId },
          data: {
            dataCollected: collectedData as Prisma.InputJsonValue
          }
        })

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

  res
    .status(200)
    .json({ message: 'User data collection jobs processed', results })
}
