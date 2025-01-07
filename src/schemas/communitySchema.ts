import { z } from 'zod'

export const PublicCommunitySchema = z.object({
  id: z.string(),
  name: z.string(),
  colour: z.string().nullable(),
  description: z.string().nullable(),
  logo: z.string().nullable(),
  facebook: z.string().nullable(),
  instagram: z.string().nullable(),
  tiktok: z.string().nullable(),
  linkedin: z.string().nullable(),
  website: z.string().nullable()
})

export const GetCommunitiesParamsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(12),
  search: z.string().optional()
})

export type PublicCommunityType = z.infer<typeof PublicCommunitySchema>
export type GetCommunitiesParams = z.infer<typeof GetCommunitiesParamsSchema>
