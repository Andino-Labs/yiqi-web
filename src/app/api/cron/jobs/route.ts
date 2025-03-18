import { notificationScheduler } from '@/lib/cron/notificationScheduler'
import { processQueueJobs } from '@/lib/cron/queueCron'
import { processQueueJobsHeavy } from '@/lib/cron/queueCronHeavy'
import { publishScheduledPosts } from '@/lib/twitter/publishScheduledPosts'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('cron job starting')
    await Promise.allSettled([
      processQueueJobs(),
      processQueueJobsHeavy(),
      notificationScheduler(),
      publishScheduledPosts()
    ])

    return new NextResponse(null, { status: 200 })
  } catch (e) {
    console.error(e)
    return new NextResponse(null, { status: 500 })
  }
}
