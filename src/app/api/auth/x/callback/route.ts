import { NextResponse } from 'next/server'
import crypto from 'crypto'

const X_CLIENT_ID = process.env.X_CLIENT_ID as string
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_URL}${process.env.NEXT_PUBLIC_X_REDIRECT_URI}`

export async function GET() {
  if (!X_CLIENT_ID) {
    return NextResponse.json(
      { error: 'X_CLIENT_ID is not defined' },
      { status: 500 }
    )
  }

  const codeVerifier = crypto.randomBytes(32).toString('hex')
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url')

  const response = NextResponse.redirect(
    `https://twitter.com/i/oauth2/authorize?${new URLSearchParams({
      response_type: 'code',
      client_id: X_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: 'tweet.read tweet.write users.read offline.access',
      state: crypto.randomBytes(16).toString('hex'),
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    })}`
  )

  response.cookies.set('code_twitter_verifier', codeVerifier, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/'
  })

  return response
}
