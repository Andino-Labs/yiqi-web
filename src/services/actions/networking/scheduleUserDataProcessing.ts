'use server'

import { processUserFirstPartyData } from '@/lib/data/processors/processUserFirstPartyData'

export async function scheduleUserDataProcessing(
  userId: string
): Promise<void> {
  if (!userId) {
    throw new Error('userId is required')
  }
  try {
    console.time('processUserFirstPartyData')
    await processUserFirstPartyData(userId)
    console.timeEnd('processUserFirstPartyData')
  } catch (error) {
    throw new Error(`${error}`)
  }
}
