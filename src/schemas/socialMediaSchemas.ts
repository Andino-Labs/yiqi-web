import { z } from 'zod'
import { SocialMediaPlatform } from '@prisma/client'

export const FacebookPageDetailsSchema = z.object({
  access_token: z.string(),
  category: z.string(),
  category_list: z.array(
    z.object({
      id: z.string(),
      name: z.string()
    })
  ),
  name: z.string(),
  id: z.string(),
  tasks: z.array(z.string())
})

export const SocialMediaAccountSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  platform: z.nativeEnum(SocialMediaPlatform),
  accountId: z.string(),
  accountName: z.string(),
  accessToken: z.string(),
  refreshToken: z.string().nullable(),
  expiresAt: z.date().nullable(),
  scope: z.array(z.string()),
  extraDetails: z
    .object({
      facebookPageDetails: FacebookPageDetailsSchema.optional()
    })
    .optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const ConnectAccountInputSchema = z.object({
  organizationId: z.string(),
  platform: z.nativeEnum(SocialMediaPlatform),
  accountId: z.string(),
  accountName: z.string(),
  accessToken: z.string(),
  refreshToken: z.string().nullable(),
  expiresAt: z.date().nullable(),
  scope: z.array(z.string()),
  extraDetails: z
    .object({
      facebookPageDetails: FacebookPageDetailsSchema.optional()
    })
    .optional()
})

export const InitiateOAuthFlowInputSchema = z.object({
  organizationId: z.string(),
  platform: z.nativeEnum(SocialMediaPlatform)
})

export const InitiateOAuthFlowOutputSchema = z.object({
  authUrl: z.string().url()
})

export const ExchangeCodeForTokenOutputSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().nullable(),
  expiresAt: z.date().nullable(),
  accountId: z.string(),
  accountName: z.string(),
  scope: z.array(z.string())
})

export type FacebookPageDetails = z.infer<typeof FacebookPageDetailsSchema>
export type SocialMediaAccount = z.infer<typeof SocialMediaAccountSchema>
export type ConnectAccountInput = z.infer<typeof ConnectAccountInputSchema>
export type InitiateOAuthFlowInput = z.infer<
  typeof InitiateOAuthFlowInputSchema
>
export type InitiateOAuthFlowOutput = z.infer<
  typeof InitiateOAuthFlowOutputSchema
>
export type ExchangeCodeForTokenOutput = z.infer<
  typeof ExchangeCodeForTokenOutputSchema
>
