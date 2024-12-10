import { z } from 'zod'
import { userSchema } from './userSchema'
import { NotificationType } from '@prisma/client'

export const NotificationSchema = z.object({
  id: z.string(),
  user: userSchema.nullable(),
  type: z.nativeEnum(NotificationType).nullable(),
  sentAt: z.coerce.date()
})

export type NotificationSchemaType = z.infer<typeof NotificationSchema>
