import { z } from 'zod'

export const PublicCommunitySchema = z.object({
  id: z.string(),
  name: z.string(),
  colour: z.string().nullable(),
  description: z.string().nullable(),
  logo: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  stripeAccountId: z.string().nullable(),
  facebook: z.string().url().nullable(),
  instagram: z.string().url().nullable(),
  tiktok: z.string().url().nullable(),
  linkedin: z.string().url().nullable(),
  website: z.string().url().nullable(),
  userId: z.string().url().nullable()
})

export type PublicCommunityType = z.infer<typeof PublicCommunitySchema>
