import prisma from '@/lib/prisma'
import { JobType, NotificationType } from '@prisma/client'

interface PaymentReminder {
  eventId: string
  userId: string
}

export async function scheduleMissingPayment() {
  const now = new Date()

  // Time ranges for scenarios
  // Scenario 1: Registration is between 10 and 20 minutes ago.
  const twentyMinutesAgo = new Date(now.getTime() - 20 * 60 * 1000)
  const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000)

  // Scenario 2: Event starts between 23 and 24 hours from now.
  const twentyFourHoursAhead = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const twentyThreeHoursAhead = new Date(now.getTime() + 23 * 60 * 60 * 1000)

  // Scenario 3: Event starts between 1.5 and 2 hours from now.
  const twoHoursAhead = new Date(now.getTime() + 2 * 60 * 60 * 1000)
  const oneAndHalfHoursAhead = new Date(now.getTime() + 1.5 * 60 * 60 * 1000)

  // We only look back 4 hours to avoid spam
  const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000)

  // Get recent reminders to avoid spamming the same user for the same event
  const recentNotifications = await prisma.queueJob.findMany({
    where: {
      notificationType: NotificationType.RESERVATION_PAYMENT_REMINDER,
      createdAt: { gte: fourHoursAgo }
    },
    select: { eventId: true, userId: true }
  })

  const recentlyNotifiedSet = new Set(
    recentNotifications.map(
      notification => `${notification.eventId}-${notification.userId}`
    )
  )

  // Fetch only registrations that match any of the scenarios
  const registrations = await prisma.eventRegistration.findMany({
    where: {
      paid: false,
      paymentId: { not: null },
      OR: [
        // Scenario 1: Registration between 10 and 20 minutes ago
        {
          createdAt: {
            gte: twentyMinutesAgo,
            lte: tenMinutesAgo
          },
          event: {
            startDate: { lte: now } // Assuming scenario 1 applies to events that have started or are due now
          }
        },
        // Scenario 2: Event starts 23–24 hours from now
        {
          event: {
            startDate: {
              gte: twentyThreeHoursAhead,
              lte: twentyFourHoursAhead
            }
          }
        },
        // Scenario 3: Event starts 1.5–2 hours from now
        {
          event: {
            startDate: {
              gte: oneAndHalfHoursAhead,
              lte: twoHoursAhead
            }
          }
        }
      ]
    },
    select: {
      eventId: true,
      userId: true
    }
  })

  // Filter out any registrations that have already been sent a recent reminder
  const reminders: PaymentReminder[] = []
  for (const registration of registrations) {
    const key = `${registration.eventId}-${registration.userId}`
    if (!recentlyNotifiedSet.has(key)) {
      reminders.push({
        eventId: registration.eventId,
        userId: registration.userId
      })
    }
  }

  return reminders.map(reminder => ({
    type: JobType.SEND_USER_MESSAGE,
    data: {},
    notificationType: NotificationType.RESERVATION_PAYMENT_REMINDER,
    userId: reminder.userId,
    eventId: reminder.eventId
  }))
}
