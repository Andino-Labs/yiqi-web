import { z } from 'zod'

// Interface for Google JWT Header (same as original)
export interface GoogleJWTHeader {
  alg: 'RS256'
  typ: 'JWT'
  kid: string
}

// Interface for Google JWT Payload (same as original)
export interface GoogleJWTPayload {
  iss: 'https://accounts.google.com'
  aud: string // Client ID
  sub: string // User ID
  iat: number // Issued at
  exp: number // Expiration
  email: string // User email
  email_verified: boolean // Email verification status
  name: string // Full name
  given_name: string // First name
  family_name: string // Last name
  picture?: string // Profile picture URL
  locale?: string // Locale information
}

// Google JWT Token Interface (same as original)
export interface GoogleJWTToken {
  header: GoogleJWTHeader
  payload: GoogleJWTPayload
  signature: string
}

// Modified Schema for Google JWT with simplified fields
export const GoogleJWTSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  picture: z.string().url().optional()
})

// Updated type to reflect simplified Google User schema
export type GoogleUser = z.infer<typeof GoogleJWTSchema>
