import { z } from 'zod'

export const OrganizerSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  organizationId: z.string().cuid('Invalid organization ID'),
  role: z.enum(['ADMIN', 'VIEWER'])
})
