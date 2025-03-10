import axios from 'axios'
import { NextResponse } from 'next/server'

const X_API_KEY = process.env.X_API_KEY as string
const X_API_SECRET = process.env.X_API_SECRET as string

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const oauth_token = searchParams.get('oauth_token')
    const oauth_verifier = searchParams.get('oauth_verifier')

    if (!oauth_token || !oauth_verifier) {
      return NextResponse.json(
        { error: 'The oauth_token and oauth_verifier parameters are required.' },
        { status: 400 }
      )
    }

    const accessTokenUrl = 'https://api.twitter.com/oauth/access_token'
    const params = new URLSearchParams({ oauth_token, oauth_verifier })

    const response = await axios.post(accessTokenUrl, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${X_API_KEY}:${X_API_SECRET}`).toString('base64')}`
      }
    })

    const result = new URLSearchParams(response.data)
    const accessToken = result.get('oauth_token')
    const accessTokenSecret = result.get('oauth_token_secret')
    const userId = result.get('user_id')
    const screenName = result.get('screen_name')

    if (!accessToken || !accessTokenSecret || !userId) {
      return NextResponse.json(
        { error: 'Failed to obtain access tokens.' },
        { status: 500 }
      )
    }

    const redirectUrl = new URL('/admin/organizations/channels/twitter', request.url)
    redirectUrl.searchParams.append('accessToken', accessToken)
    redirectUrl.searchParams.append('accessTokenSecret', accessTokenSecret)
    redirectUrl.searchParams.append('userId', userId)
    if (screenName) {
      redirectUrl.searchParams.append('screenName', screenName)
    }

    return NextResponse.redirect(redirectUrl)
  } catch (error: unknown) {
    console.error('Error exchanging tokens:', error instanceof Error ? error.message : error)
    return NextResponse.json(
      { error: 'Error connecting to Twitter.' },
      { status: 500 }
    )
  }
}
