import { z } from 'zod'
import { searchUsers } from '../actions/userActions'
import { publicProcedure, router } from './util'
import { getUserRegistrationStatus } from '../actions/eventActions'
import { getOrganization } from '../actions/organizationActions'
import {
  getEventFilterSchema,
  getPublicEventsFilterSchema,
  registrationInputSchema,
  SavedEventSchema
} from '@/schemas/eventSchema'
import {
  SearchUserResultSchema,
  UserRegistrationStatusSchema,
  OrganizationSchema
} from '@/schemas/apiSchemas'
import { getEvent } from '../actions/event/getEvent'
import { getPublicEvents } from '../actions/event/getPublicEvents'
import { createRegistration } from '@/lib/event/createRegistration'
import { loginLinkedin } from '@/lib/auth/loginLinkedin'
import { loginGoogle } from '@/lib/auth/loginGoogle'

export const appRouter = router({
  loginLinkedin: publicProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ input }) => {
      return loginLinkedin(input)
    }),
  loginGoogle: publicProcedure
    .input(z.object({ idToken: z.string({ message: 'idToken prob!!' }) }))
    .mutation(async ({ input }) => {
      return loginGoogle(input)
    }),
  searchUsers: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const result = await searchUsers(input.query)
      return SearchUserResultSchema.parse(result)
    }),

  getPublicEvents: publicProcedure
    .input(z.optional(getPublicEventsFilterSchema))
    .query(async ({ input }) => {
      const events = await getPublicEvents(input)
      return events
    }),

  getEvent: publicProcedure
    .input(getEventFilterSchema)
    .query(async ({ input }) => {
      const event = await getEvent(input)
      return SavedEventSchema.parse(event)
    }),

  createRegistration: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        registrationData: registrationInputSchema
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new Error('User not signed in')
      }

      const registration = await createRegistration(
        ctx.user,
        input.eventId,
        input.registrationData
      )

      return registrationInputSchema.parse(registration)
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
