'use server'

import prisma from '@/lib/prisma'
import { NotificationSchemaType } from '@/schemas/notificationsSchema'

export async function getEventNotifications(eventId: string) {
  const notifications = await prisma.queueJob.findMany({
    where: {
      eventId,
      notificationType: {
        not: null
      }
    },
    include: {
      user: true
    }
  })
  const data: NotificationSchemaType[] = notifications.map(notification => {
    const parsed: NotificationSchemaType = {
      id: notification.id,
      user: notification.user,
      type: notification.notificationType,
      sentAt: notification.createdAt
    }
    return parsed
  })

  return data
}
