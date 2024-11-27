import {
  SendBaseMessageToUserPropsSchema,
  sendBaseMessageToUser
} from '@/services/notifications/sendBaseMessageToUser'
import sendPaymentReminder from '@/services/notifications/sendPaymentReminder'
import prisma from '../prisma'
import { NotificationType } from '@prisma/client'

export async function sendNotificationCron() {
  // Find notifications that need to be sent
  const notificationsToSend = await prisma.notification.findMany({
    where: {
      scheduledFor: {
        lte: new Date()
      },
      sentAt: null,
      user: {
        stopCommunication: false
      },
      tries: {
        lt: 3
      }
    },
    include: {
      user: true,
      event: true,
      organization: true,
      form: true
    },
    take: 20
  })

  // Send the reminders
  for (const notification of notificationsToSend) {
    try {
      if (notification.event) {
        if (
          notification.type === NotificationType.RESERVATION_PAYMENT_REMINDER
        ) {
          if (!notification.user) {
            throw new Error('User is missing for payment reminder notification')
          }

          await sendPaymentReminder({
            user: notification.user,
            event: notification.event,
            org: notification.organization
          })
        } else if (notification.type === NotificationType.BASE_NOTIFICATION) {
          const data = SendBaseMessageToUserPropsSchema.parse(
            notification.extraData
          )

          await sendBaseMessageToUser(data)
        }
      }

      // Mark the notification as sent
      await prisma.notification.update({
        where: { id: notification.id },
        data: { sentAt: new Date() }
      })
    } catch (error) {
      console.error('Error processing notification:', {
        notificationId: notification.id,
        notificationType: notification.type,
        userId: notification.user?.id,
        eventId: notification.event?.id,
        organizationId: notification.organization?.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        extraData: notification.extraData
      })

      // Increment the tries
      await prisma.notification.update({
        where: { id: notification.id },
        data: { tries: { increment: 1 } }
      })

      // Continue with next notification
      continue
    }
  }
}
