import prisma from '@/lib/prisma'
import { JobType, NotificationType } from '@prisma/client'

interface EventReminder {
  eventId: string
  userId: string
}

export async function scheduleEventReminders() {
  const now = new Date()

  // Time ranges for reminders
  const twentyFourHoursAhead = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const fourHoursAhead = new Date(now.getTime() + 4 * 60 * 60 * 1000)
  const threeAndHalfHoursAhead = new Date(now.getTime() + 3.5 * 60 * 60 * 1000)
  const twoAndHalfHoursAhead = new Date(now.getTime() + 2.5 * 60 * 60 * 1000)
  const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000)

  // Get registrations for 24-hour reminders using optimized query
  const registrations24h = await prisma.$queryRaw<EventReminder[]>`
    SELECT er."eventId", er."userId"
    FROM "EventRegistration" er
    INNER JOIN "Event" e ON er."eventId" = e.id
    WHERE er.status = 'APPROVED'
    AND e."startDate" > ${fourHoursAhead}
    AND e."startDate" <= ${twentyFourHoursAhead}
    AND NOT EXISTS (
      SELECT 1 FROM "QueueJob" qj
      WHERE qj."eventId" = er."eventId"
      AND qj."userId" = er."userId"
      AND qj."notificationType" = ${NotificationType.RESERVATION_REMINDER}
      AND qj."createdAt" >= ${twelveHoursAgo}
    )
  `

  // Get registrations for 3-hour reminders using optimized query
  const registrations3h = await prisma.$queryRaw<EventReminder[]>`
    SELECT er."eventId", er."userId"
    FROM "EventRegistration" er
    INNER JOIN "Event" e ON er."eventId" = e.id
    WHERE er.status = 'APPROVED'
    AND e."startDate" > ${twoAndHalfHoursAhead}
    AND e."startDate" <= ${threeAndHalfHoursAhead}
    AND NOT EXISTS (
      SELECT 1 FROM "QueueJob" qj
      WHERE qj."eventId" = er."eventId"
      AND qj."userId" = er."userId"
      AND qj."notificationType" = ${NotificationType.RESERVATION_REMINDER}
      AND qj."createdAt" >= ${twelveHoursAgo}
    )
  `

  // Combine all reminders
  const reminders = [...registrations24h, ...registrations3h]

  // Map reminders to queue jobs
  return reminders.map(reminder => ({
    type: JobType.SEND_USER_MESSAGE,
    data: {},
    notificationType: NotificationType.RESERVATION_REMINDER,
    userId: reminder.userId,
    eventId: reminder.eventId
  }))
}
