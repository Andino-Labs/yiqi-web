import { z } from 'zod'
import { userSchema } from './userSchema'

export enum NotificationType {
  ORG_INVITE,
  RESERVATION_PAYMENT_REMINDER,
  RESERVATION_CONFIRMED,
  RESERVATION_REJECTED,
  RESERVATION_REMINDER,
  BASE_NOTIFICATION
}

export const NotificationSchema = z.object({
  id: z.string(),
  user: userSchema,
  type: z.nativeEnum(NotificationType),
  sentAt: z.string(),
  scheduledFor: z.coerce.date()
})

export type NotificationSchemaType = z.infer<typeof NotificationSchema>
