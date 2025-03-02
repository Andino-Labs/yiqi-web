import { z } from 'zod'
import { profileWithPrivacySchema, userSchema } from './userSchema'

export enum AttendeeStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum EventTypeEnum {
  ONLINE = 'ONLINE',
  IN_PERSON = 'IN_PERSON'
}

export const CustomFieldSchema = z.object({
  name: z.string().min(1, 'Field name is required'),
  type: z.enum(['text', 'number', 'select', 'date']),
  required: z.boolean().optional().default(true),
  options: z
    .string()
    .optional()
    .describe('Comma-separated list of options for select fields')
})

export const EventTicketOfferingInputSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.enum(['GENERAL', 'VIP', 'BACKSTAGE']),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  limit: z.number().min(1, 'Limit must be at least 1'),
  ticketsPerPurchase: z
    .number()
    .min(1, 'Must allow at least 1 ticket per purchase')
})

export const CustomField = z.object({
  name: z.string(),
  description: z.string(),
  type: z.enum(['text', 'number', 'date', 'boolean', 'url']),
  inputType: z.enum(['shortText', 'longText']),
  required: z.boolean().optional(),
  defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional()
})

export const CustomFieldsSchema = z.object({
  fields: z.array(CustomField),
  eventData: z.array(z.record(z.any())).optional()
})

export type CustomFieldType = z.infer<typeof CustomField>
export type CustomFieldsSchemaType = z.infer<typeof CustomFieldsSchema>

export const EventInputSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  location: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  virtualLink: z
    .string()
    .transform(val => (val === '' ? null : val))
    .pipe(z.string().url().nullable())
    .optional()
    .nullable(),
  description: z.string().optional(),
  maxAttendees: z.number().int().positive().optional().nullable(),
  requiresApproval: z.boolean().default(false),
  openGraphImage: z.string().optional().nullable(),
  type: z.nativeEnum(EventTypeEnum),
  latLon: z
    .object({
      lat: z.number().optional().nullable(),
      lon: z.number().optional().nullable()
    })
    .optional()
    .nullable(),
  timezoneLabel: z.string(),
  customFields: z.preprocess(val => {
    if (typeof val === 'string') {
      try {
        return JSON.parse(val)
      } catch {
        return val
      }
    }
    return val
  }, CustomFieldsSchema.optional().nullable())
})

export const EventCommunitySchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  location: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  virtualLink: z
    .string()
    .transform(val => (val === '' ? null : val))
    .pipe(z.string().url().nullable())
    .optional()
    .nullable(),
  description: z.string().optional(),
  maxAttendees: z.number().int().positive().optional().nullable(),
  requiresApproval: z.boolean().default(false),
  openGraphImage: z.string().optional().nullable(),
  type: z.nativeEnum(EventTypeEnum),
  timezoneLabel: z.string()
})

export const EventSchema = EventInputSchema.extend({
  id: z.string()
})
export const TicketCategorySchema = z.enum(['GENERAL', 'VIP', 'BACKSTAGE'])

export const SavedTicketOfferingSchema = EventTicketOfferingInputSchema.extend({
  id: z.string(),
  price: z.coerce.number()
})

export type EventTicketInputType = z.infer<
  typeof EventTicketOfferingInputSchema
>
export type SavedTicketOfferingType = z.infer<typeof SavedTicketOfferingSchema>

// this is the ticket the user has
export const TicketSchema = z.object({
  id: z.string(),
  user: userSchema.nullable().optional(),
  checkedInDate: z.date().nullable(),
  category: TicketCategorySchema,
  ticketType: SavedTicketOfferingSchema.nullable().optional()
})

export const EventRegistrationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  customFields: z.record(z.any()).optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  paid: z.boolean(),
  paymentId: z.string().nullable(),
  user: userSchema,
  tickets: z.array(TicketSchema)
})
// Registration result schema
export const createRegisterSchema = z.object({
  success: z.boolean(),
  registration: z.object({
    id: z.string(),
    userId: z.string(),
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
    customFields: z.record(z.any()),
    createdAt: z.date(),
    updatedAt: z.date(),
    paid: z.boolean(),
    paymentId: z.string().nullable()
  }),
  message: z.string()
})
export const createCustomFieldSchema = (field: CustomFieldInputType) => {
  switch (field.type) {
    case 'text':
      return z.string()
    case 'number':
      return z.number()
    case 'date':
      return z.date()
    case 'select':
      return z.enum(
        field.options?.split(',').map(o => o.trim()) as [string, ...string[]]
      )
    default:
      return z.string()
  }
}

export const createAttendeeSchema = (customFields: CustomFieldInputType[]) => {
  const baseSchema = z.object({
    email: z.string().email('Invalid email address').optional()
  })

  const customFieldsSchema = z.object(
    customFields.reduce(
      (acc, field) => {
        acc[field.name] = field.required
          ? createCustomFieldSchema(field)
          : createCustomFieldSchema(field).optional()
        return acc
      },
      {} as Record<string, z.ZodTypeAny>
    )
  )

  return baseSchema.merge(customFieldsSchema)
}

export const SavedEventSchema = EventInputSchema.extend({
  id: z.string(),
  organizationId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  tickets: z.array(SavedTicketOfferingSchema).optional().nullable()
})

export const PublicEventSchema = SavedEventSchema.extend({
  id: z.string(),
  registrations: z.number(),
  organization: z.object({
    logo: z.string().nullable(),
    name: z.string(),
    stripeAccountId: z.string().optional().nullable()
  }),
  heroImage: z.string().nullable(),
  backgroundColor: z.string().nullable(),
  featuredIn: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().url()
      })
    )
    .optional()
    .nullable(),
  subtitle: z.string().optional().nullable(),
  hosts: z.array(profileWithPrivacySchema).optional().nullable(),
  tickets: z.array(SavedTicketOfferingSchema)
})

export type PublicEventType = z.infer<typeof PublicEventSchema>
export type EventInputType = z.infer<typeof EventInputSchema>
export type EventCommunityType = z.infer<typeof EventCommunitySchema>
export type EventType = z.infer<typeof EventSchema>

export type CustomFieldInputType = z.infer<typeof CustomFieldSchema>
export type EditEventInputType = z.infer<typeof SavedEventSchema>
export type EventRegistrationSchemaType = z.infer<
  typeof EventRegistrationSchema
>
export type SavedEventType = z.infer<typeof SavedEventSchema>
export const eventRegistrationStatusSchema = z.nativeEnum(AttendeeStatus)
export const eventTicketTypeSchema = z.enum(['GENERAL', 'VIP', 'BACKSTAGE'])

export const eventRegistrationsSchema = z.object({
  id: z.string(),
  user: userSchema,
  status: eventRegistrationStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  paid: z.boolean(),
  paymentId: z.string().optional().nullable(),
  customFields: z.any().optional().nullable(),
  tickets: z.array(
    z.object({
      id: z.string(),
      price: z.coerce.number(),
      name: z.string(),
      type: eventTicketTypeSchema
    })
  )
})

export type EventRegistrationsSchemaType = z.infer<
  typeof eventRegistrationsSchema
>

export const organizationEventSchema = EventInputSchema.extend({
  id: z.string()
})

export type OrganizationEventSchemaType = z.infer<
  typeof organizationEventSchema
>

export const registrationInputSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  customFieldsData: z.record(z.any()).optional(),
  tickets: z.record(z.string(), z.number().min(0).max(5))
})

export const getPublicEventsFilterSchema = z.object({
  title: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  type: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional()
})
export const getEventFilterSchema = z.object({
  eventId: z.string(),
  includeTickets: z.boolean().optional()
})

export type RegistrationInput = z.infer<typeof registrationInputSchema>
export type GetPublicEventsInput = z.infer<typeof getPublicEventsFilterSchema>
export type GetEventFilterSchemaType = z.infer<typeof getEventFilterSchema>

export const organizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  colour: z.string().nullable(),
  description: z.string().nullable(),
  logo: z.string().nullable(),
  facebook: z.string().nullable(),
  instagram: z.string().nullable(),
  tiktok: z.string().nullable(),
  linkedin: z.string().nullable(),
  website: z.string().nullable(),
  billingInfo: z
    .object({
      accountName: z.string(),
      accountNumber: z.string(),
      country: z.string()
    })
    .nullable()
})
