'use server'

import { AuthClient } from 'linkedin-api-client'
import prisma from '@/lib/prisma'
import { getUser } from '@/lib/auth/lucia'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const user = await getUser()
  console.log('made it here')
  console.log(code)
  console.log('=---------------')

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const redirectUrl = `${process.env.NEXT_PUBLIC_URL}${process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI}`
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

    const { access_token } = tokenDetails

    // Save user data to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        linkedinAccessToken: access_token
      }
    })

    return NextResponse.redirect(new URL('/user/networking-settings', req.url))
  } catch (error) {
    console.error('Error fetching LinkedIn data:', error)
    return new Response('Failed to fetch LinkedIn data', { status: 500 })
  }
}
