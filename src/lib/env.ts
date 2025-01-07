const baseUrl = process.env.NEXT_PUBLIC_URL

if (!baseUrl) {
  throw new Error('no NEXT_PUBLIC_URL was found')
}

export const BASE_URL = baseUrl
