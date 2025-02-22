import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'es', 'fr', 'pt']
const defaultLocale = 'es'

function getLocaleFromHeader(acceptLanguage: string | null): string {
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim().substring(0, 2))
      .find(lang => locales.includes(lang))

    if (preferredLocale) {
      return preferredLocale
    }
  }
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const localeCookie = request.cookies.get('locale')
  const fullUrl = request.url

  // Clone the request headers and append the full URL
  const requestHeaders = new Headers()
  requestHeaders.set('x-full-url', fullUrl)

  if (!localeCookie) {
    const acceptLanguage = request.headers.get('Accept-Language')
    const locale = getLocaleFromHeader(acceptLanguage)

    request.cookies.set({
      name: 'locale',
      value: locale
    })
  }

  return NextResponse.next({
    headers: requestHeaders
  })
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
