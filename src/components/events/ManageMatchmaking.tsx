'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { UserPlus, PartyPopper } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import type { INetworkingData } from '../lumalike/template1'

export interface MatchmakingStatus {
  isUserCheckedInOngoingEvent: boolean
  isUserRegistered: boolean
  networkingData: INetworkingData | null
  userDetailedProfile?: string | null
}

interface RenderMatchmakingInfoProps {
  eventId: string
  initialStatus?: MatchmakingStatus | null
}

export function RenderMatchmakingInfo({
  eventId,
  initialStatus
}: RenderMatchmakingInfoProps) {
  const router = useRouter()
  const t = useTranslations('EventManageMatchmaking')
  const [status, setStatus] = useState<MatchmakingStatus | null>(
    initialStatus ?? null
  )

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/event/${eventId}/status`)
        if (!response.ok) throw new Error('Status fetch failed')
        const data = (await response.json()) as MatchmakingStatus
        setStatus(data)
      } catch (error) {
        console.error('Polling error:', error)
        setStatus(null)
      }
    }

    const intervalId = setInterval(fetchStatus, 2000)
    fetchStatus()

    return () => clearInterval(intervalId)
  }, [eventId])

  if (!status) {
    return null
  }

  function getResumeText(): boolean {
    if (!status) {
      return false
    }
    if (!status.networkingData) {
      return false
    }

    const resumeText = status.networkingData.resumeText

    if (resumeText === null || resumeText === undefined) {
      return false
    }

    if (typeof resumeText === 'string' || resumeText === '') {
      return true
    }

    return false
  }

  const isProfileComplete = Boolean(
    getResumeText() && status.userDetailedProfile
  )

  const getDescription = () => {
    if (!isProfileComplete) return t('missingProfile')
    if (!status.isUserCheckedInOngoingEvent) return t('missingCheckIn')
    if (!status.userDetailedProfile) return t('matchMakingInProgress')
    return t('readyForAIMatching')
  }

  const getButtonContent = () => {
    if (!isProfileComplete) {
      return (
        <>
          <UserPlus className="mr-2 h-4 w-4 flex-shrink-0" />
          {t('completeProfile')}
        </>
      )
    }
    if (status.isUserCheckedInOngoingEvent) {
      return (
        <>
          <PartyPopper className="mr-2 h-4 w-4 flex-shrink-0" />
          {t('viewMatches')}
        </>
      )
    }
    return null
  }

  const getNavigationPath = () => {
    if (!isProfileComplete) return '/user/networking-settings'
    if (!status.isUserCheckedInOngoingEvent) return '/user/tickets'
    return `/${eventId}/networking`
  }

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="p-6 bg-gradient-to-br from-[#6de4e8]/15 to-[#6de4e8]/5 rounded-xl backdrop-blur-lg border border-[#6de4e8]/30 shadow-lg shadow-[#6de4e8]/10 hover:shadow-[#6de4e8]/20 transition-shadow"
      >
        <p className="text-sm md:text-base text-[#6de4e8] font-semibold text-center md:text-left">
          {getDescription()}
        </p>
        {status.isUserCheckedInOngoingEvent && (
          <Button
            variant="ghost"
            size="lg"
            onClick={() => router.push(getNavigationPath())}
            className="mt-4 w-full md:w-auto bg-[#6de4e8]/10 hover:bg-[#6de4e8]/20 text-[#6de4e8] hover:text-[#6de4e8]/90 transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
          >
            {getButtonContent()}
          </Button>
        )}
      </motion.div>
    </div>
  )
}
