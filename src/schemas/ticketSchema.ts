import { z } from 'zod'

export const organizationSchema = z.object({
  id: z.string(),
  logo: z.string().url(),
  name: z.string()
})

export const customFieldsSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  tickets: z.record(z.string(), z.number())
})

const registrationSchema = z.object({
  customFields: customFieldsSchema,
  paid: z.boolean(),
  paymentId: z.string().nullable()
})

const ticketSchema = z.object({
  id: z.string(),
  description: z.string().nullable(),
  registrationId: z.string(),
  userId: z.string(),
  checkedInDate: z.date().nullable(),
  checkedInByUserId: z.string().nullable(),
  category: z.enum(['GENERAL', 'VIP', 'BACKSTAGE']),
  ticketTypeId: z.string(),
  registration: registrationSchema,
  status: z.enum(['APPROVED', 'PENDING', 'REJECTED'])
})

export const eventSchema = z.object({
  title: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  openGraphImage: z.string(),
  type: z.enum(['IN_PERSON', 'VIRTUAL']),
  id: z.string(),
  organizationId: z.string(),
  organization: organizationSchema
})

export const ticketEventSchema = z.array(
  z.object({
    event: eventSchema,
    tickets: z.array(ticketSchema)
  })
)

export type ticketEventSchemaType = z.infer<typeof ticketEventSchema>
