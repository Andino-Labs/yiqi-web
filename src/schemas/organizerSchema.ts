import { z } from 'zod'

export const OrganizerSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  organizationId: z.string().cuid('Invalid organization ID'),
  role: z.enum(['ADMIN', 'VIEWER'])
})

export const OrganizationSchema = z.object({
  id: z.string().cuid('Invalid organization ID'),
  name: z.string().min(1, 'Organization name is required'),
  colour: z.string().min(1, 'Organization colour is required'),
  logo: z.string().optional(),
  description: z.string().optional()
})

export type OrganizationType = z.infer<typeof OrganizationSchema>

export type OrganizerType = z.infer<typeof OrganizerSchema>
