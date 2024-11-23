'use client'

import React, { useCallback, useState } from 'react'
import { Button } from '../ui/button'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Users, Sparkles, Layout, Link2Off } from 'lucide-react'
import { cn } from '@/lib/utils'
import { disconnectLinkedin } from '@/services/actions/user/disconnectLinkedin'
import { toast } from '@/hooks/use-toast'
import { translations } from '@/lib/translations/translations'

interface BenefitProps {
  icon: React.ReactNode
  title: string
  description: string
}

function Benefit({ icon, title, description }: BenefitProps) {
  return (
    <div className="flex items-start space-x-4">
      <div className="rounded-lg bg-primary/10 p-2">{icon}</div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function LinkedInLink() {
  const handleLinkClick = () => {
    const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID
    const redirectUri = `${process.env.NEXT_PUBLIC_URL}${process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI}`
    const scope = 'r_fullprofile r_member_social'
    const state = 'random_string' // Use a secure random string
    const encodedRedirectUri = encodeURIComponent(redirectUri)
    const encodedScope = encodeURIComponent(scope)
    const encodedState = encodeURIComponent(state)
    console.log(clientId, redirectUri, scope, state)
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodedRedirectUri}&scope=${encodedScope}&state=${encodedState}`

    window.location.href = authUrl
  }

  return (
    <Button onClick={() => handleLinkClick()} className="btn-linkedin">
      {translations.es.linkedinConnectButton}
    </Button>
  )
}
type Props = {
  isConnected: boolean
}
export default function LinkedInConnect({
  isConnected: isLinkedinConnected
}: Props) {
  const [isConnected, setIsConnected] = useState(isLinkedinConnected)

  const handleDisconnect = useCallback(async () => {
    const { success } = await disconnectLinkedin()
    if (success) {
      toast({
        title: translations.es.linkedinDisconnectedToast,
        description: translations.es.linkedinDisconnectedToastDesc
      })
      setIsConnected(false)
    } else {
      toast({
        title: translations.es.linkedinErrorToast,
        description: translations.es.linkedinErrorToastDesc
      })
    }
  }, [])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl sm:text-3xl">
          {translations.es.linkedinEnhanceTitle}
        </CardTitle>
        <CardDescription className="text-base">
          {translations.es.linkedinEnhanceDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-1">
          <Benefit
            icon={<Users className="w-5 h-5 text-primary" />}
            title={translations.es.linkedinBenefitMatchTitle}
            description={translations.es.linkedinBenefitMatchDescription}
          />
          <Benefit
            icon={<Sparkles className="w-5 h-5 text-primary" />}
            title={translations.es.linkedinBenefitHighlightsTitle}
            description={translations.es.linkedinBenefitHighlightsDescription}
          />
          <Benefit
            icon={<Layout className="w-5 h-5 text-primary" />}
            title={translations.es.linkedinBenefitContentTitle}
            description={translations.es.linkedinBenefitContentDescription}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        {!isConnected && <LinkedInLink />}

        {isConnected && (
          <>
            <Button
              variant="outline"
              size="lg"
              className={cn('w-full sm:w-auto', !isConnected && 'hidden')}
              onClick={handleDisconnect}
            >
              <Link2Off className="w-5 h-5 mr-2" />
              {translations.es.linkedinDisconnectButton}
            </Button>
            <p className="text-sm text-muted-foreground">
              {translations.es.linkedinConnectedMessage}
            </p>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
