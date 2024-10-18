'use server'
import { lucia } from '@/lib/auth/lucia'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { generateCodeVerifier, generateState } from 'arctic'
import { googleOAuthClient } from '@/lib/auth/lucia'

export const logOut = async () => {
  const sessionCookie = await lucia.createBlankSessionCookie()
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  )
  return redirect('/auth')
}

export const getGoogleOauthConsentUrl = async () => {
  try {
    const state = generateState()
    const codeVerifier = generateCodeVerifier()

    cookies().set('codeVerifier', codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    })
    cookies().set('state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    })

    const authUrl = await googleOAuthClient.createAuthorizationURL(
      state,
      codeVerifier,
      {
        scopes: ['email', 'profile']
      }
    )
    return { success: true, url: authUrl.toString() }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Something went wrong' }
  }
}
