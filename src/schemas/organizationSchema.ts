import { z } from 'zod'

export const OrganizationSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  logo: z.string().url({ message: 'Invalid URL' }).optional(),
  colour: z.string().min(1, { message: 'Colour is required' }),
  facebook: z
    .string()
    .url({ message: 'Invalid URL' })
    .optional()
    .or(z.literal('')),
  instagram: z
    .string()
    .url({ message: 'Invalid URL' })
    .optional()
    .or(z.literal('')),
  tiktok: z
    .string()
    .url({ message: 'Invalid URL' })
    .optional()
    .or(z.literal('')),
  linkedin: z
    .string()
    .url({ message: 'Invalid URL' })
    .optional()
    .or(z.literal('')),
  website: z
    .string()
    .url({ message: 'Invalid URL' })
    .optional()
    .or(z.literal(''))
})
export const UpdateOrganizationSchema = OrganizationSchema.partial()

export const SavedOrganizationSchema = OrganizationSchema.extend({
  id: z.string(),
  eventCount: z.number().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})
