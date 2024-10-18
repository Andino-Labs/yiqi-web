import { z } from 'zod'

export const CustomFieldSchema = z.object({
  name: z.string().min(1, 'Field name is required'),
  type: z.enum(['text', 'number', 'select', 'date']),
  required: z.boolean().optional().default(true),
  options: z
    .string()
    .optional()
    .describe('Comma-separated list of options for select fields')
})

export const EventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  description: z.string().optional(),
  location: z.string().nullable().optional().default(''),
  customFields: z.array(CustomFieldSchema),
  requiresApproval: z.boolean().optional().default(false)
})

export const createCustomFieldSchema = (field: CustomFieldInput) => {
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

export const createAttendeeSchema = (customFields: CustomFieldInput[]) => {
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

export const DbEventSchema = EventSchema.extend({
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

export type EventInput = z.infer<typeof EventSchema>
export type CustomFieldInput = z.infer<typeof CustomFieldSchema>
export type EditEventInput = z.infer<typeof DbEventSchema>
