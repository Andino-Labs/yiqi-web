import { z } from 'zod'

// Schema for the included user data
export const networkingMatchUserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  picture: z.string().nullable().optional(),
  dataCollected: z
    .object({
      linkedin: z.string().optional(),
      x: z.string().optional(),
      instagram: z.string().optional()
    })
    .nullable()
})

// Schema for a single networking match
export const networkingMatchSchema = z.object({
  id: z.string(),
  personDescription: z.string(),
  matchReason: z.string(),
  userId: z.string(),
  registrationId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  user: networkingMatchUserSchema
})

// Schema for an array of networking matches (what getNetworkingMatches returns)
export const networkingMatchesSchema = z.array(networkingMatchSchema)

// Type definitions for TypeScript
export type NetworkingMatchType = z.infer<typeof networkingMatchSchema>
export type NetworkingMatchesType = z.infer<typeof networkingMatchesSchema>
