import { lucia } from '@/lib/auth/lib'
import prisma from '@/lib/prisma'
import { AuthClient } from 'linkedin-api-client'
import jwt from 'jsonwebtoken'
import { LinkedInJWTSchema } from '@/types/linkedin'

export async function loginLinkedin({ code }: { code: string }) {
  const redirectUrl = `${process.env.NEXT_PUBLIC_URL}${process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_AUTH_URI}`
  console.log(redirectUrl)

  try {
    const authClient = new AuthClient({
      clientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      redirectUrl: redirectUrl
    })

    // Exchange authorization code for access token
    const tokenDetails = await authClient.exchangeAuthCodeForAccessToken(
      code as string
    )

    const linkedUser = LinkedInJWTSchema.parse(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      jwt.decode(tokenDetails.id_token as string, {
        complete: true
      })
    )

    let userId = ''

    const existingUser = await prisma.user.findUnique({
      where: {
        email: linkedUser.payload.email.toLowerCase()
      }
    })

    if (existingUser) {
      userId = existingUser.id
    } else {
      const user = await prisma.user.create({
        data: {
          name: `${linkedUser.payload.name}`,
          email: linkedUser.payload.email.toLowerCase(),
          picture: linkedUser.payload.picture,
          privacySettings: {
            email: true,
            phoneNumber: true,
            linkedin: true,
            x: true,
            website: true
          }
        }
      })
      userId = user.id
    }

    const session = await lucia.createSession(userId, {})

    return {
      sessionId: session.id
    }
  } catch (error) {
    console.error('Error during LinkedIn authentication:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
