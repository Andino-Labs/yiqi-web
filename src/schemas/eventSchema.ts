import { z } from 'zod'
import { userSchema } from './userSchema'

export const CustomFieldSchema = z.object({
  name: z.string().min(1, 'Field name is required'),
  type: z.enum(['text', 'number', 'select', 'date']),
  required: z.boolean().optional().default(true),
  options: z
    .string()
    .optional()
    .describe('Comma-separated list of options for select fields')
})

export const EventTicketInputSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.enum(['GENERAL', 'VIP', 'BACKSTAGE']),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  limit: z.number().min(1, 'Limit must be at least 1'),
  ticketsPerPurchase: z
    .number()
    .min(1, 'Must allow at least 1 ticket per purchase')
})
export const EventInputSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  startDate: z.string(),
  startTime: z.string(),
  endDate: z.string(),
  endTime: z.string(),
  location: z.string().optional(),
  virtualLink: z.string().url().optional(),
  description: z.string().optional(),
  maxAttendees: z.number().int().positive().optional(),
  requiresApproval: z.boolean().default(false),
  openGraphImage: z.string().optional(),
  tickets: z
    .array(EventTicketInputSchema)
    .min(1, 'At least one ticket type is required')
})

export const EventSchema = EventInputSchema.extend({
  id: z.string()
})
export const TicketCategorySchema = z.enum(['GENERAL', 'VIP', 'BACKSTAGE'])

export type EventTicketInputType = z.infer<typeof EventTicketInputSchema>
// this is the ticket the user has
export const TicketSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  user: userSchema.nullable(),
  checkedInDate: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  category: TicketCategorySchema
})

export const EventRegistrationSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  userId: z.string(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  customFields: z.record(z.any()),
  createdAt: z.date(),
  updatedAt: z.date(),
  paid: z.boolean(),
  paymentId: z.string().nullable(),
  user: userSchema,
  event: EventInputSchema.nullable(),
  tickets: z.array(TicketSchema)
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

export const DbEventSchema = EventInputSchema.extend({
  id: z.string(),
  organizationId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  customFields: z
    .array(CustomFieldSchema)
    .optional()
    .nullable()
    .transform(val => val ?? [])
})

export type EventInputType = z.infer<typeof EventInputSchema>
export type EventType = z.infer<typeof EventSchema>

export type CustomFieldInputType = z.infer<typeof CustomFieldSchema>
export type EditEventInputType = z.infer<typeof DbEventSchema>
export type EventRegistrationSchemaType = z.infer<
  typeof EventRegistrationSchema
>
