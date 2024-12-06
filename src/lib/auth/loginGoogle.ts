import { OAuth2Client } from 'google-auth-library'
import { lucia } from '@/lib/auth/lib'
import prisma from '@/lib/prisma'
import { GoogleJWTSchema } from '@/types/google'

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!
)

export async function loginGoogle({ idToken }: { idToken: string }) {
  try {
    // Verify the ID token with the Google Auth client
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID!
    })

    const payload = ticket.getPayload()

    // Ensure the token is valid and the email is verified
    if (!payload || !payload.email_verified) {
      throw new Error('Email not verified by Google')
    }

    // Validate and parse the Google user info using Zod schema
    const googleUser = GoogleJWTSchema.parse({
      email: payload.email,
      name: payload.name,
      picture: payload.picture
    })

    // Convert email to lowercase for consistency
    const email = googleUser.email.toLowerCase()
    let userId: string = ''

    // Check if the user already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      userId = existingUser.id
    } else {
      // Create a new user if not found
      const newUser = await prisma.user.create({
        data: {
          name: googleUser.name,
          email,
          picture: googleUser.picture,
          privacySettings: {
            email: true,
            phoneNumber: true,
            google: true,
            x: true,
            website: true
          }
        }
      })
      userId = newUser.id
    }

    // Create a session for the authenticated user
    const session = await lucia.createSession(userId, {})

    return { sessionId: session.id }
  } catch (error) {
    console.error('Error during Google authentication:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
