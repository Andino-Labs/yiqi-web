import { lucia } from '@/lib/auth/lib'
import prisma from '@/lib/prisma'
import { AuthClient } from 'linkedin-api-client'
import jwt from 'jsonwebtoken'
import { LinkedInJWTSchema } from '@/types/linkedin'
import { downloadAndUploadImage } from '@/lib/downloadAndUploadImage'

export async function loginLinkedin({ code }: { code: string }) {
  const redirectUrl = `https://www.yiqi.lat`

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
      // Download and upload the profile picture to S3
      const s3ImageUrl = await downloadAndUploadImage(
        linkedUser.payload.picture
      )

      const user = await prisma.user.create({
        data: {
          name: `${linkedUser.payload.name}`,
          email: linkedUser.payload.email.toLowerCase(),
          picture: s3ImageUrl,
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
