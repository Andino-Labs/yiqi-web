// pages/api/checkUnpaidUsers.ts

import prisma from '@/lib/prisma'
import {
  sendBaseMessageToUser,
  SendBaseMessageToUserPropsSchema
} from '@/services/notifications/sendBaseMessageToUser'
import sendPaymentReminder from '@/services/notifications/sendPaymentReminder'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Find notifications that need to be sent
  const notificationsToSend = await prisma.notification.findMany({
    where: {
      scheduledFor: {
        lte: new Date()
      },
      sentAt: null,
      user: {
        stopCommunication: false
      }
    },
    include: {
      user: true,
      event: true,
      organization: true,
      form: true // Add this line
    },
    take: 20
  })

  // Send the reminders
  for (const notification of notificationsToSend) {
    if (notification.event) {
      if (notification.type === 'RESERVATION_PAYMENT_REMINDER') {
        if (!notification.user) {
          throw 'user is missing'
        }
        if (!notification.event) {
          throw 'event is missing'
        }

        await sendPaymentReminder(
          notification.user,
          notification.event,
          notification.organization
        )
      } else if (notification.type === 'BASE_NOTIFICATION') {
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
  }

  res.status(200).json({ message: 'Notifications sent' })
}
