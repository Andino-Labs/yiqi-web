// app/api/event/[eventId]/status/route.ts
import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/lucia'
import { validateCheckIn } from '@/services/actions/event/validateCheckIn'
import { getUserProfile } from '@/services/actions/userActions'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  console.log(request)
  const user = await getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [isCheckedIn, registration, profile] = await Promise.all([
      validateCheckIn(params.eventId, user.id),
      prisma.eventRegistration.findFirst({
        where: { eventId: params.eventId, userId: user.id },
        select: { id: true }
      }),
      getUserProfile(user.id)
    ])

    return NextResponse.json({
      isUserCheckedInOngoingEvent: isCheckedIn,
      isUserRegistered: Boolean(registration?.id),
      networkingData: profile
        ? {
            professionalMotivations: profile.professionalMotivations || '',
            communicationStyle: profile.communicationStyle || '',
            professionalValues: profile.professionalValues || '',
            careerAspirations: profile.careerAspirations || '',
            significantChallenge: profile.significantChallenge || '',
            resumeText: profile.resumeText || ''
          }
        : null,
      userDetailedProfile: profile?.userDetailedProfile || null
    })
  } catch (error) {
    return NextResponse.json(
      { error: `Failed, ${error} to fetch status` },
      { status: 500 }
    )
  }
}
