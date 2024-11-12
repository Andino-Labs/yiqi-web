// pages/api/checkUnpaidUsers.ts

import { releaseLock, tryToGetLock } from '@/lib/cronLock'
import { generateMediasCron } from '@/lib/cron/generateMediasCron'
import { NextResponse } from 'next/server'

const JOB_NAME = 'generateMedias'
export async function POST() {
  try {
    await tryToGetLock(JOB_NAME)

    const results = await generateMediasCron()

    NextResponse.json({
      message: 'OG images generation jobs processed',
      results
    })
  } catch (error) {
    NextResponse.json({ message: (error as Error).message }, { status: 500 })
  } finally {
    await releaseLock(JOB_NAME)
  }
}
