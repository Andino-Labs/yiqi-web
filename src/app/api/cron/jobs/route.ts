import { notificationScheduler } from '@/lib/cron/notificationScheduler'
import { processQueueJobs } from '@/lib/cron/queueCron'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await Promise.all([processQueueJobs(), notificationScheduler()])

    return new NextResponse(null, { status: 200 })
  } catch (e) {
    console.error(e)
    return new NextResponse(null, { status: 500 })
  }
}
