import { releaseLock, tryToGetLock } from '@/lib/cronLock'
import { dataCollectorsCron } from '@/lib/cron/dataCollectorsCron'
import { NextResponse } from 'next/server'

const JOB_NAME = 'dataCollectors'
export async function POST() {
  try {
    await tryToGetLock(JOB_NAME)

    await dataCollectorsCron()
    NextResponse.json({ message: 'dataCollectors job completed' })
  } catch (error) {
    NextResponse.json({ message: (error as Error).message }, { status: 500 })
  } finally {
    await releaseLock(JOB_NAME)
  }
}
