import * as superjson from 'superjson'
import * as _trpc_server from '@trpc/server'

declare enum EventTypeEnum {
  ONLINE = 'ONLINE',
  IN_PERSON = 'IN_PERSON'
}

declare const appRouter: _trpc_server.CreateRouterInner<
  _trpc_server.RootConfig<{
    ctx: object
    meta: object
    errorShape: _trpc_server.DefaultErrorShape
    transformer: typeof superjson.default
  }>,
  {
    searchUsers: _trpc_server.BuildProcedure<
      'query',
      {
        _config: _trpc_server.RootConfig<{
          ctx: object
          meta: object
          errorShape: _trpc_server.DefaultErrorShape
          transformer: typeof superjson.default
        }>
        _meta: object
        _ctx_out: object
        _input_in: {
          query: string
        }
        _input_out: {
          query: string
        }
        _output_in: typeof _trpc_server.unsetMarker
        _output_out: typeof _trpc_server.unsetMarker
      },
      {
        name: string
        id: string
        email: string
        picture: string | null
        emailVerified?: Date | null | undefined
        phoneNumber?: string | null | undefined
      }[]
    >
    getPublicEvents: _trpc_server.BuildProcedure<
      'query',
      {
        _config: _trpc_server.RootConfig<{
          ctx: object
          meta: object
          errorShape: _trpc_server.DefaultErrorShape
          transformer: typeof superjson.default
        }>
        _ctx_out: object
        _input_in: typeof _trpc_server.unsetMarker
        _input_out: typeof _trpc_server.unsetMarker
        _output_in: typeof _trpc_server.unsetMarker
        _output_out: typeof _trpc_server.unsetMarker
        _meta: object
      },
      {
        events: {
          id: string
          title: string
          startDate: Date
          endDate: Date
          organizationId: string
          customFields: {
            name: string
            type: 'number' | 'select' | 'date' | 'text'
            required: boolean
            options?: string | undefined
          }[]
          createdAt: Date
          updatedAt: Date
          requiresApproval: boolean
          type: EventTypeEnum
          backgroundColor: string | null
          heroImage: string | null
          organization: {
            name: string
            logo: string | null
            stripeAccountId?: string | null | undefined
          }
          registrations: number
          tickets: {
            name: string
            id: string
            category: 'GENERAL' | 'VIP' | 'BACKSTAGE'
            price: number
            limit: number
            ticketsPerPurchase: number
            description?: string | undefined
          }[]
          subtitle?: string | null | undefined
          description?: string | undefined
          location?: string | null | undefined
          city?: string | null | undefined
          state?: string | null | undefined
          country?: string | null | undefined
          virtualLink?: string | null | undefined
          maxAttendees?: number | null | undefined
          openGraphImage?: string | null | undefined
          featuredIn?:
            | {
                name: string
                url: string
              }[]
            | null
            | undefined
          hosts?:
            | {
                name: string
                id: string
                email: string
                privacySettings: {
                  linkedin: boolean
                  website: boolean
                  email: boolean
                  phoneNumber: boolean
                  x: boolean
                }
                stopCommunication: boolean
                isLinkedinLinked: boolean
                instagram?: string | null | undefined
                linkedin?: string | null | undefined
                website?: string | null | undefined
                picture?: string | undefined
                phoneNumber?: string | undefined
                linkedinAccessToken?: string | undefined
                company?: string | null | undefined
                position?: string | null | undefined
                shortDescription?: string | null | undefined
                x?: string | null | undefined
                professionalMotivations?: string | null | undefined
                communicationStyle?: string | null | undefined
                professionalValues?: string | null | undefined
                careerAspirations?: string | null | undefined
                significantChallenge?: string | null | undefined
                resumeUrl?: string | null | undefined
                resumeText?: string | null | undefined
                resumeLastUpdated?: string | null | undefined
              }[]
            | null
            | undefined
        }[]
        totalCount: number
      }
    >
    getEvent: _trpc_server.BuildProcedure<
      'query',
      {
        _config: _trpc_server.RootConfig<{
          ctx: object
          meta: object
          errorShape: _trpc_server.DefaultErrorShape
          transformer: typeof superjson.default
        }>
        _meta: object
        _ctx_out: object
        _input_in: string
        _input_out: string
        _output_in: typeof _trpc_server.unsetMarker
        _output_out: typeof _trpc_server.unsetMarker
      },
      {
        id: string
        title: string
        startDate: Date
        endDate: Date
        organizationId: string
        customFields: {
          name: string
          type: 'number' | 'select' | 'date' | 'text'
          required: boolean
          options?: string | undefined
        }[]
        createdAt: Date
        updatedAt: Date
        requiresApproval: boolean
        type: EventTypeEnum
        description?: string | undefined
        location?: string | null | undefined
        city?: string | null | undefined
        state?: string | null | undefined
        country?: string | null | undefined
        virtualLink?: string | null | undefined
        maxAttendees?: number | null | undefined
        openGraphImage?: string | null | undefined
        tickets?:
          | {
              name: string
              category: 'GENERAL' | 'VIP' | 'BACKSTAGE'
              price: number
              limit: number
              ticketsPerPurchase: number
              description?: string | undefined
            }[]
          | {
              name: string
              id: string
              category: 'GENERAL' | 'VIP' | 'BACKSTAGE'
              price: number
              limit: number
              ticketsPerPurchase: number
              description?: string | undefined
            }[]
          | null
          | undefined
      }
    >
    createRegistration: _trpc_server.BuildProcedure<
      'mutation',
      {
        _config: _trpc_server.RootConfig<{
          ctx: object
          meta: object
          errorShape: _trpc_server.DefaultErrorShape
          transformer: typeof superjson.default
        }>
        _meta: object
        _ctx_out: object
        _input_in: {
          eventId: string
          registrationData: {
            name: string
            tickets: Record<string, number>
            email: string
          }
        }
        _input_out: {
          eventId: string
          registrationData: {
            name: string
            tickets: Record<string, number>
            email: string
          }
        }
        _output_in: typeof _trpc_server.unsetMarker
        _output_out: typeof _trpc_server.unsetMarker
      },
      {
        name: string
        tickets: Record<string, number>
        email: string
      }
    >
    getUserRegistrationStatus: _trpc_server.BuildProcedure<
      'query',
      {
        _config: _trpc_server.RootConfig<{
          ctx: object
          meta: object
          errorShape: _trpc_server.DefaultErrorShape
          transformer: typeof superjson.default
        }>
        _meta: object
        _ctx_out: object
        _input_in: {
          userId: string
          eventId: string
        }
        _input_out: {
          userId: string
          eventId: string
        }
        _output_in: typeof _trpc_server.unsetMarker
        _output_out: typeof _trpc_server.unsetMarker
      },
      boolean
    >
    getOrganization: _trpc_server.BuildProcedure<
      'query',
      {
        _config: _trpc_server.RootConfig<{
          ctx: object
          meta: object
          errorShape: _trpc_server.DefaultErrorShape
          transformer: typeof superjson.default
        }>
        _meta: object
        _ctx_out: object
        _input_in: string
        _input_out: string
        _output_in: typeof _trpc_server.unsetMarker
        _output_out: typeof _trpc_server.unsetMarker
      },
      {
        name: string
        id: string
        description: string | null
        createdAt: Date
        updatedAt: Date
        userId: string
        logo: string | null
      }
    >
  }
>
type AppRouter = typeof appRouter

export type { AppRouter }
