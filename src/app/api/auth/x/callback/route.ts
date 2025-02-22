import axios from 'axios'
import oauth from 'oauth-1.0a'
import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

const X_API_KEY = process.env.X_API_KEY as string
const X_API_SECRET = process.env.X_API_SECRET as string
const oauth1 = new oauth({
  consumer: {
    key: X_API_KEY,
    secret: X_API_SECRET
  },
  signature_method: 'HMAC-SHA1',
  hash_function: (baseString: string, key: string): string => {
    return crypto.createHmac('sha1', key).update(baseString).digest('base64')
  }
})

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const refererUrl = req.headers.get('referer') || '/'

    const requestTokenUrl = 'https://api.twitter.com/oauth/request_token'
    const requestTokenResponse = await axios.post(requestTokenUrl, null, {
      headers: Object.fromEntries(
        Object.entries(
          oauth1.toHeader(
            oauth1.authorize({
              url: requestTokenUrl,
              method: 'POST'
            })
          )
        )
      )
    })

    const requestToken = new URLSearchParams(requestTokenResponse.data)
    const oauthToken = requestToken.get('oauth_token')
    const oauthTokenSecret = requestToken.get('oauth_token_secret')

    if (!oauthToken || !oauthTokenSecret) {
      return NextResponse.json(
        { error: 'No se pudo obtener los tokens OAuth.' },
        { status: 500 }
      )
    }

    const authorizationUrl = `https://api.twitter.com/oauth/authorize?oauth_token=${oauthToken}&redirect_uri=${encodeURIComponent(refererUrl)}`
    return NextResponse.redirect(authorizationUrl)
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error en el proceso de autenticación:', error.message)
    } else {
      console.error('Error en el proceso de autenticación:', error)
    }
    return NextResponse.json(
      { error: 'Error en el proceso de autenticación.' },
      { status: 500 }
    )
  }
}
