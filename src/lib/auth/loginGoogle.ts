import { OAuth2Client } from 'google-auth-library'
import { lucia } from '@/lib/auth/lib'
import prisma from '@/lib/prisma'
import { GoogleJWTSchema } from '@/types/google'
import { downloadAndUploadImage } from '@/lib/downloadAndUploadImage'

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
    let user

    // Check if the user already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        picture: true,
        role: true
      }
    })

    if (existingUser) {
      user = existingUser
    } else {
      // Download and upload the profile picture to S3
      const s3ImageUrl = await downloadAndUploadImage(googleUser.picture)

      // Create a new user with the S3 image URL
      const newUser = await prisma.user.create({
        data: {
          name: googleUser.name,
          email,
          picture: s3ImageUrl,
          privacySettings: {
            email: true,
            phoneNumber: true,
            google: true,
            x: true,
            website: true
          }
        },
        select: {
          id: true,
          name: true,
          email: true,
          picture: true,
          role: true
        }
      })
      user = newUser
    }
    // Create a session for the authenticated user
    const session = await lucia.createSession(user.id, {})

    return { sessionId: session.id, user }
  } catch (error) {
    console.error('Error during Google authentication:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
