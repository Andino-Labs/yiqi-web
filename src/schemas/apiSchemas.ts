import { z } from 'zod'
import { SavedEventSchema } from './eventSchema'
import { luciaUserSchema, userSchema } from './userSchema'

export const AttendeeStatusSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED'])

export const OrganizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  logo: z.string().nullable(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const SearchUserResultSchema = z.array(userSchema)

export const PublicEventsSchema = z.array(SavedEventSchema)

export const UserRegistrationStatusSchema = z.boolean()

export const AuthSchemaSchema = z.object({
  sessionId: z.string(),
  user: luciaUserSchema
})
