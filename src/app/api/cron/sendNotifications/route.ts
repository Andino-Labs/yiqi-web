// pages/api/checkUnpaidUsers.ts

import { sendNotificationCron } from '@/lib/cron/sendNotificationCron'
import { releaseLock, tryToGetLock } from '@/lib/cronLock'
import { NextResponse } from 'next/server'

const JOB_NAME = 'sendNotifications'
export async function POST() {
  try {
    await tryToGetLock(JOB_NAME)

    await sendNotificationCron()

    NextResponse.json({ message: 'Notifications sent' })
  } catch (error) {
    NextResponse.json({ message: (error as Error).message }, { status: 500 })
  } finally {
    await releaseLock(JOB_NAME)
  }
}
