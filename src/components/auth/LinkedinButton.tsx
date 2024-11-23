'use client'

import { Button } from '../ui/button'

export default function LinkedInOAuthButton() {
  const handleLinkClick = () => {
    const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID
    const redirectUri = `${process.env.NEXT_PUBLIC_URL}${process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_AUTH_URI}`
    const scope = 'openid profile email'
    const state = 'random_string' // Use a secure random string
    const encodedRedirectUri = encodeURIComponent(redirectUri)
    const encodedScope = encodeURIComponent(scope)
    const encodedState = encodeURIComponent(state)
    console.log(clientId, redirectUri, scope, state)
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodedRedirectUri}&scope=${encodedScope}&state=${encodedState}`

    window.location.href = authUrl
  }

  return (
    <Button
      className="flex flex-row gap-2 w-full"
      variant={'outline'}
      onClick={async () => {
        handleLinkClick()
      }}
    >
      Ingresa con Linkedin
    </Button>
  )
}
