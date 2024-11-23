export interface LinkedInJWTHeader {
  zip: 'RS256'
  typ: 'JWT'
  kid: string
  alg: 'RS256'
}

export interface LinkedInJWTPayload {
  iss: 'https://www.linkedin.com/oauth'
  aud: string
  iat: number
  exp: number
  sub: string
  name: string
  given_name: string
  family_name: string
  picture: string
  email: string
  email_verified: string
  locale: string
}

export interface LinkedInJWTToken {
  header: LinkedInJWTHeader
  payload: LinkedInJWTPayload
  signature: string
}

// Optional: Create a Zod schema for validation
import { z } from 'zod'

export const LinkedInJWTSchema = z.object({
  header: z.object({
    zip: z.literal('RS256'),
    typ: z.literal('JWT'),
    kid: z.string(),
    alg: z.literal('RS256')
  }),
  payload: z.object({
    iss: z.literal('https://www.linkedin.com/oauth'),
    aud: z.string(),
    iat: z.number(),
    exp: z.number(),
    sub: z.string(),
    name: z.string(),
    given_name: z.string(),
    family_name: z.string(),
    picture: z.string().url(),
    email: z.string().email(),
    email_verified: z.string(),
    locale: z.string()
  }),
  signature: z.string()
})

export type LinkedInJWT = z.infer<typeof LinkedInJWTSchema>
