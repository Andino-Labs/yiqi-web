import { z } from 'zod'
import { PublicCommunitySchema } from './communitySchema'

export const AdminOrganizationSchema = PublicCommunitySchema.extend({
  billingInfo: z
    .object({
      accountName: z.string(),
      accountNumber: z.string(),
      country: z.string()
    })
    .nullable()
})

export type AdminOrganizationType = z.infer<typeof AdminOrganizationSchema>
