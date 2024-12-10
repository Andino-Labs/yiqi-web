'use server'

import setupNewThreads from './setupNewThreads'

export default async function setupInitialEventNotifications({
  orgId,
  userId
}: {
  orgId: string
  userId: string
}) {
  // Setup new threads for the user if they don't exist
  await setupNewThreads(userId, orgId)
}
