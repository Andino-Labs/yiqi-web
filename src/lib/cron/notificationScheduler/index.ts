'use server'

import prisma from '@/lib/prisma'
import { scheduleMissingPayment } from './scheduleMissingPayment'

export async function notificationScheduler() {
  const paymentReminders = await scheduleMissingPayment()

  await prisma.queueJob.createMany({
    data: paymentReminders.map(reminder => ({
      type: 'SEND_USER_MESSAGE',
      data: {},
      notificationType: 'RESERVATION_PAYMENT_REMINDER',
      userId: reminder.userId,
      eventId: reminder.eventId
    }))
  })
}
