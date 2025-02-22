import { lucia } from '@/lib/auth/lib'
import prisma from '@/lib/prisma'
import { AuthClient } from 'linkedin-api-client'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { LinkedInJWTSchema } from '@/types/linkedin'
import { downloadAndUploadImage } from '@/lib/downloadAndUploadImage'

// http://localhost:3000/api/auth/linkedin/callback
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')

  if (!code) {
    return new Response('Unauthorized', { status: 401 })
  }

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

    console.log(existingUser)

    if (existingUser) {
      userId = existingUser.id
    } else {
      const user = await prisma.user.create({
        data: {
          name: `${linkedUser.payload.name}`,
          email: linkedUser.payload.email.toLowerCase(),
          picture: await downloadAndUploadImage(linkedUser.payload.picture),
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
    const sessionCookie = await lucia.createSessionCookie(session.id)
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    )

    const redirectCookie = cookies().get('redirect')
    if (redirectCookie) {
      return NextResponse.redirect(new URL(redirectCookie.value, req.url))
    }

    return NextResponse.redirect(new URL('/newuser', req.url))
  } catch (error) {
    console.error('Error during LinkedIn authentication:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
