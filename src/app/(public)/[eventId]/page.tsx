import { EventPage } from '@/components/lumalike/template1'
import { getUser } from '@/lib/auth/lucia'
import { getEventById } from '@/services/actions/event/getEventById'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { JSDOM } from 'jsdom'
import { validateCheckIn } from '@/services/actions/event/validateCheckIn'
import prisma from '@/lib/prisma'
import { getUserProfile } from '@/services/actions/userActions'
type Props = {
  params: { eventId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEventById(params.eventId)

  if (!event) {
    return {
      title: 'Event Not Found'
    }
  }

  // Create a JSDOM instance
  const dom = new JSDOM(event.description || '')
  const text = dom.window.document.body.textContent || ''
  const ogImage = event.openGraphImage || event.heroImage || '/og.png'

  const description =
    text ||
    event.subtitle ||
    `Join us at ${event.title} on ${event.startDate.toLocaleDateString()}`
  return {
    title: event.title,
    description: description,
    openGraph: {
      title: event.title,
      description: description,
      images: [ogImage]
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description: description,
      images: [ogImage]
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_URL}/events/${event.id}`
    }
  }
}

export default async function Page({
  params
}: {
  params: { eventId: string }
}) {
  const currentUser = await getUser()
  const event = await getEventById(params.eventId)

  if (!event) {
    redirect('/')
  }

  // Initialize state variables
  let isUserCheckedInOngoingEvent = false
  let isUserRegistered = false
  let networkingData = null
  let userDetailedProfile = null

  if (currentUser) {
    // Parallelize async calls
    const [checkInStatus, registration, userProfile] = await Promise.all([
      validateCheckIn(params.eventId, currentUser.id),
      prisma.eventRegistration.findFirst({
        where: {
          AND: [{ eventId: params.eventId }, { userId: currentUser.id }]
        },
        select: { id: true }
      }),
      getUserProfile(currentUser.id)
    ])

    // Set derived state
    isUserCheckedInOngoingEvent = checkInStatus
    isUserRegistered = Boolean(registration?.id)

    if (userProfile) {
      networkingData = {
        professionalMotivations: userProfile.professionalMotivations ?? '',
        communicationStyle: userProfile.communicationStyle ?? '',
        professionalValues: userProfile.professionalValues ?? '',
        careerAspirations: userProfile.careerAspirations ?? '',
        significantChallenge: userProfile.significantChallenge ?? '',
        resumeText: userProfile.resumeText ?? ''
      }
      userDetailedProfile = userProfile.userDetailedProfile || null
    }
  }

  return (
    <>
      <div className="fixed inset-0 h-screen w-screen -z-10 bg-black" />
      <EventPage
        customFields={event.customFields?.fields}
        event={event}
        user={currentUser ?? undefined}
        isUserRegistered={isUserRegistered}
        initialStatus={
          currentUser
            ? {
                isUserCheckedInOngoingEvent,
                isUserRegistered,
                networkingData,
                userDetailedProfile
              }
            : null
        }
      />
    </>
  )
}
