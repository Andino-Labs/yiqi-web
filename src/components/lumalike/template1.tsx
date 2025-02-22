'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { HeroImage } from './template1-components/hero-image'
import { EventDetails } from './template1-components/event-details'
import { Registration } from './template1-components/registration'
import { Hosts } from './template1-components/hosts'
import { EventDescription } from './template1-components/event-description'
import { EventLocation } from './template1-components/event-location'
import MainLandingNav from '../mainLanding/mainNav'
import { useTranslations } from 'next-intl'
import { ManageMatchmaking } from '../events/ManageMatchmaking'
import { PublicEventType, CustomFieldType } from '@/schemas/eventSchema'
import { LuciaUserType } from '@/schemas/userSchema'

export interface INetworkingData {
  professionalMotivations: string
  communicationStyle: string
  professionalValues: string
  careerAspirations: string
  significantChallenge: string
  resumeText: string
}
export function EventPage({
  event,
  isUserCheckedInOngoingEvent,
  isUserRegistered,
  user,
  customFields,
  networkingData
}: {
  event: PublicEventType
  isUserCheckedInOngoingEvent: boolean
  isUserRegistered: boolean
  user?: LuciaUserType
  customFields?: CustomFieldType[]
  networkingData: INetworkingData | null
}) {
  const [isMobile, setIsMobile] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const registrationRef = useRef<HTMLDivElement>(null)
  const dialogTriggerRef = useRef<HTMLButtonElement | null>(null)

  const t = useTranslations('Community')
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()

    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (registrationRef.current) {
        const rect = registrationRef.current.getBoundingClientRect()
        if (rect.top <= 0) {
          setIsSticky(true)
        } else {
          setIsSticky(false)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <MainLandingNav
        user={user}
        showExtraButton={isSticky}
        buttonName={t('eventRegister')}
        dialogTriggerRef={dialogTriggerRef}
      />
      <div
        style={
          event.backgroundColor
            ? { backgroundColor: event.backgroundColor }
            : {}
        }
        className="fixed inset-0 h-screen w-screen -z-10 bg-black"
      />
      <main className="container mx-auto px-4 py-12 text-primary-foreground pt-16 bg-black">
        <div className="mt-6">
          <motion.div
            className={`flex flex-col sm:flex-row gap-8 ${isMobile ? 'opacity-100 transform-none px-5' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col gap-4">
              {event.openGraphImage && (
                <div className="w-full md:w-3/4 lg:w-full">
                  <HeroImage src={event.openGraphImage} alt={event.title} />
                </div>
              )}
              {event.hosts && !isMobile && (
                <>
                  <h2 className="text-2xl font-semibold text-primary-foreground">
                    {t('membersOrganizedBy')}
                  </h2>
                  <hr className="my-6 border-t border-solid border-white-opacity-40 w-[100%] ml-0 mx-auto" />
                  <Hosts hosts={event.hosts} />
                </>
              )}
              {!isMobile && (
                <motion.div
                  className={`space-y-12 ${
                    isMobile ? '' : 'mt-6 lg:sticky lg:top-24 lg:self-start'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Registration
                    customFields={customFields}
                    event={event}
                    user={user}
                    dialogTriggerRef={dialogTriggerRef}
                  />
                </motion.div>
              )}
              {!!isUserRegistered && user && (
                <ManageMatchmaking
                  userDetailedProfile={user.userDetailedProfile}
                  event={event}
                  isUserCheckedInOngoingEvent={!!isUserCheckedInOngoingEvent}
                  networkingData={networkingData}
                />
              )}
            </div>
            <div className="flex flex-col gap-8 w-full">
              <EventDetails event={event} />
              {event.hosts && isMobile && (
                <>
                  <h2 className="text-2xl font-semibold text-primary-foreground">
                    {t('membersOrganizedBy')}
                  </h2>
                  <hr className="my-6 border-t border-solid border-white-opacity-40 w-[100%] ml-0 mx-auto" />
                  <Hosts hosts={event.hosts} />
                </>
              )}
              <motion.div
                ref={registrationRef}
                className={`space-y-12 ${isMobile ? 'flex-col' : 'lg:top-24 lg:self-start'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {isMobile && (
                  <>
                    <hr className="my-6 border-t border-solid border-white-opacity-40 w-[100%] ml-0 mx-auto" />
                    <Registration
                      customFields={customFields}
                      event={event}
                      user={user}
                      dialogTriggerRef={dialogTriggerRef}
                    />
                  </>
                )}
              </motion.div>
              <EventDescription description={event.description || ''} />
              {event.location && <EventLocation location={event.location} />}
            </div>
          </motion.div>
        </div>
      </main>
    </>
  )
}
