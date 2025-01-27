'use server'

import prisma from '@/lib/prisma'
import { scheduleMissingPayment } from './scheduleMissingPayment'
import { scheduleEventReminders } from './scheduleEventReminders'

export async function notificationScheduler() {
  const paymentReminders = await scheduleMissingPayment()
  const eventReminders = await scheduleEventReminders()
  await prisma.queueJob.createMany({
    data: [...paymentReminders, ...eventReminders]
  })
}
