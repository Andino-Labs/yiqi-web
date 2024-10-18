// pages/api/checkUnpaidUsers.ts

import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { handleGenerateEventOpenGraph } from "@/services/media/handleGenerateEventOpenGraph";
import { GenerateEventOpenGraphJobSchema } from "@/schemas/mediaJobs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Find jobs that need to be processed
  const jobs = await prisma.queueJob.findMany({
    where: {
      type: "GENERATE_EVENT_OPEN_GRAPH",
      status: "PENDING",
      attempts: { lt: 3 }, // Only get jobs that have been attempted less than 3 times
    },
    orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
    take: 5,
  });

  const results = await Promise.all(
    jobs.map(async (job) => {
      try {
        // Update job status to PROCESSING
        await prisma.queueJob.update({
          where: { id: job.id },
          data: {
            status: "PROCESSING",
            startedAt: new Date(),
            attempts: { increment: 1 },
          },
        });

        // Process the job based on its type
        if (job.type === "GENERATE_EVENT_OPEN_GRAPH") {
          const { eventId } = GenerateEventOpenGraphJobSchema.parse(job.data);
          await handleGenerateEventOpenGraph({ eventId });
        } else {
          throw new Error(`Unsupported job type: ${job.type}`);
        }

        // Update job status to COMPLETED
        await prisma.queueJob.update({
          where: { id: job.id },
          data: { status: "COMPLETED", completedAt: new Date() },
        });

        return { jobId: job.id, status: "COMPLETED" };
      } catch (error) {
        console.error(`Error processing job ${job.id}:`, error);

        // Update job status to FAILED or back to PENDING if attempts < maxAttempts
        const updatedJob = await prisma.queueJob.update({
          where: { id: job.id },
          data: {
            status: job.attempts + 1 >= job.maxAttempts ? "FAILED" : "PENDING",
            failedAt: job.attempts + 1 >= job.maxAttempts ? new Date() : null,
            error: (error as Error).message,
          },
        });

        return {
          jobId: job.id,
          status: updatedJob.status,
          error: (error as Error).message,
        };
      }
    }),
  );

  res
    .status(200)
    .json({ message: "OG images generation jobs processed", results });
}
