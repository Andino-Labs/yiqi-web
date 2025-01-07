import { cookies } from 'next/headers'

const REGISTRATION_COOKIE_PREFIX = 'event_registration_'

export function setRegistrationCookie(eventId: string, registrationId: string) {
  const cookieStore = cookies()
  const cookieName = `${REGISTRATION_COOKIE_PREFIX}${eventId}`

  // Set cookie that expires in 24 hours
  cookieStore.set(cookieName, registrationId, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })
}

export function getRegistrationCookie(eventId: string): string | undefined {
  const cookieStore = cookies()
  const cookieName = `${REGISTRATION_COOKIE_PREFIX}${eventId}`
  const cookie = cookieStore.get(cookieName)
  return cookie?.value
}

export function clearRegistrationCookie(eventId: string) {
  const cookieStore = cookies()
  const cookieName = `${REGISTRATION_COOKIE_PREFIX}${eventId}`
  cookieStore.delete(cookieName)
}
