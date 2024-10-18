import prisma from '@/lib/prisma'
import { subDays } from 'date-fns'
import setupNewThreads from './setupNewThreads'

export default async function setupInitialEventNotifications({
  eventId,
  eventStartDate,
  orgId,
  userId
}: {
  eventId: string
  orgId: string
  eventStartDate: Date
  userId: string
}) {
  // Setup new threads for the user if they don't exist
  await setupNewThreads(userId, orgId)

  const oneDayBefore = subDays(eventStartDate, 1)
  const confirmedUser = await prisma.eventRegistration.findFirst({
    where: {
      eventId,
      userId,
      status: 'APPROVED'
    }
  })

  if (confirmedUser) {
    // Create notification entries in your Notification model
    await prisma.notification.createMany({
      data: [
        {
          userId,
          eventId,
          organizationId: orgId,
          type: 'RESERVATION_CONFIRMED',
          scheduledFor: oneDayBefore
        }
      ]
    })
  }
}
