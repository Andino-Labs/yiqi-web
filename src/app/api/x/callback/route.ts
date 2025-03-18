import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const X_CLIENT_ID = process.env.X_CLIENT_ID as string
const X_CLIENT_SECRET = process.env.X_CLIENT_SECRET as string
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_URL}${process.env.NEXT_PUBLIC_X_REDIRECT_URI}`

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json(
      { error: 'authorization code not received' },
      { status: 400 }
    )
  }

  const codeVerifier = cookies().get('code_twitter_verifier')?.value
  if (!codeVerifier) {
    return NextResponse.json(
      { error: 'code_verifier not found' },
      { status: 400 }
    )
  }

  const credentials = Buffer.from(`${X_CLIENT_ID}:${X_CLIENT_SECRET}`).toString(
    'base64'
  )

  const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier
    }).toString()
  })

  const tokenData = await tokenResponse.json()

  if (!tokenResponse.ok) {
    return NextResponse.json(
      { error: 'No se pudo obtener el token' },
      { status: 401 }
    )
  }

  const { access_token, refresh_token } = tokenData

  const userResponse = await fetch('https://api.twitter.com/2/users/me', {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  })

  const userData = await userResponse.json()

  const { id, username } = userData.data

  if (!userResponse.ok) {
    return NextResponse.json({ error: 'User not found' }, { status: 401 })
  }

  const redirectUrl = new URL(
    '/admin/organizations/channels/twitter',
    request.url
  )
  redirectUrl.searchParams.append('accessToken', access_token)
  redirectUrl.searchParams.append('refreshToken', refresh_token)
  redirectUrl.searchParams.append('userId', id)
  redirectUrl.searchParams.append('screenName', username)

  return NextResponse.redirect(redirectUrl)
}
