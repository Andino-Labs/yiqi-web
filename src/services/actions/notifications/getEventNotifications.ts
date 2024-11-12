'use server'

import prisma from '@/lib/prisma'
import { NotificationSchema } from '@/schemas/notificationsSchema'

export async function getEventNotifications(eventId: string) {
  const notifications = await prisma.notification.findMany({
    where: { eventId },
    include: {
      user: true
    }
  })

  return notifications.map(notification =>
    NotificationSchema.parse(notification)
  )
}
