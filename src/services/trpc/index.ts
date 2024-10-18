import { z } from 'zod'
import { searchUsers } from '../actions/userActions'
import { publicProcedure, router } from './util'
import {
  getPublicEvents,
  getEvent,
  createRegistration,
  getUserRegistrationStatus
} from '../actions/eventActions'
import { getOrganization } from '../actions/organizationActions'
import { DbEventSchema } from '@/schemas/eventSchema'
import {
  SearchUserResultSchema,
  PublicEventsSchema,
  RegistrationSchema,
  UserRegistrationStatusSchema,
  OrganizationSchema
} from '@/schemas/apiSchemas'

export const appRouter = router({
  searchUsers: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const result = await searchUsers(input.query)
      return SearchUserResultSchema.parse(result)
    }),

  getPublicEvents: publicProcedure.query(async () => {
    const events = await getPublicEvents()
    return PublicEventsSchema.parse(events)
  }),

  getEvent: publicProcedure.input(z.string()).query(async ({ input }) => {
    const event = await getEvent(input)
    return DbEventSchema.parse(event)
  }),

  createRegistration: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        attendeeData: z.record(z.unknown())
      })
    )
    .mutation(async ({ input }) => {
      const registration = await createRegistration(
        input.eventId,
        input.attendeeData
      )
      return RegistrationSchema.parse(registration)
    }),

  getUserRegistrationStatus: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        userId: z.string()
      })
    )
    .query(async ({ input }) => {
      const status = await getUserRegistrationStatus(
        input.eventId,
        input.userId
      )
      return UserRegistrationStatusSchema.parse(status)
    }),

  getOrganization: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const organization = await getOrganization(input)
      if (!organization) throw new Error('Organization not found')
      return OrganizationSchema.parse(organization)
    })
})

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter
