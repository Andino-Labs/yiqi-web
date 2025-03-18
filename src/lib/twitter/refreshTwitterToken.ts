'use server'

import { PrismaClient } from '@prisma/client'
import { Buffer } from 'buffer'

const prisma = new PrismaClient()

export async function refreshAccessToken(twitterAccount: {
  id: number
  refreshToken: string
}) {
  try {
    const authHeader = Buffer.from(
      `${process.env.X_CLIENT_ID}:${process.env.X_CLIENT_SECRET}`
    ).toString('base64')

    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${authHeader}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: twitterAccount.refreshToken
      }).toString()
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Error refreshing token:', data)
      return null
    }

    await prisma.twitterAccount.update({
      where: { id: twitterAccount.id },
      data: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: new Date(Date.now() + Number(data.expires_in) * 1000)
      }
    })

    return data.access_token
  } catch (error) {
    console.error('Error refreshing access_token:', error)
    return null
  }
}
