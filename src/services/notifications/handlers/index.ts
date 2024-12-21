import { QueueJob } from '@prisma/client'
import { sendUserEventConfirmed } from './sendUserEventConfirmed'
import { sendUserPaymentReminder } from './sendUserPaymentReminder'

export async function handleNotificationJob(job: QueueJob) {
  if (job.notificationType === 'RESERVATION_CONFIRMED') {
    await sendUserEventConfirmed(job)
  }
  if (job.notificationType === 'RESERVATION_PAYMENT_REMINDER') {
    await sendUserPaymentReminder(job)
  }
}
