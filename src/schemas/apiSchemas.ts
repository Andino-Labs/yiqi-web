import { z } from 'zod'
import { SavedEventSchema } from './eventSchema'
import { luciaUserSchema, userSchema } from './userSchema'

export const AttendeeStatusSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED'])

export const SearchUserResultSchema = z.array(userSchema)

export const PublicEventsSchema = z.array(SavedEventSchema)

export const UserRegistrationStatusSchema = z.boolean()

export const AuthSchemaSchema = z.object({
  sessionId: z.string(),
  user: luciaUserSchema
})
