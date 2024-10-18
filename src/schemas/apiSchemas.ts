import { z } from 'zod'
import { DbEventSchema } from './eventSchema'
import { userSchema } from './userSchema'

export const AttendeeStatusSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED'])

export const RegistrationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  eventId: z.string(),
  status: AttendeeStatusSchema,
  customFields: z.record(z.unknown()),
  createdAt: z.date(),
  updatedAt: z.date()
})

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

export const PublicEventsSchema = z.array(DbEventSchema)

export const UserRegistrationStatusSchema = z.boolean()
