import prisma from '@/lib/prisma'
import { lucia } from '@/lib/auth/lucia'
import { OAuth2Client } from 'google-auth-library'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export async function handleMobileGoogleSignIn(idToken: string) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    })
    const payload = ticket.getPayload()

    if (!payload || !payload.email) {
      throw new Error('Invalid Google ID token')
    }

    let user = await prisma.user.findUnique({
      where: { email: payload.email }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          name: payload.name || '',
          picture: payload.picture || ''
        }
      })
    }

    const session = await lucia.createSession(user.id, {})

    return {
      sessionToken: session.id,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture
      }
    }
  } catch (error) {
    console.error('Error in handleMobileGoogleSignIn:', error)
    throw error
  }
}

export async function validateMobileSession(sessionToken: string) {
  try {
    const { session, user } = await lucia.validateSession(sessionToken)
    if (!session) {
      return null
    }
    return user
  } catch (error) {
    console.error('Error in validateMobileSession:', error)
    return null
  }
}
