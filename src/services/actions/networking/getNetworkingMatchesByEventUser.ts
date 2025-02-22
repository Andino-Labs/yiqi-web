'use server'

import prisma from '@/lib/prisma'
import { JobType } from '@prisma/client'
import { parseNetworkingMatches } from './parsers'

export async function getNetworkingMatchesByEventUser(
  _userId: string,
  eventId: string
) {
  const r = await prisma.eventRegistration.findUnique({
    where: { eventId_userId: { userId: _userId, eventId } },
    include: {
      user: { select: { userDetailedProfile: true } }
    }
  })
  console.debug('userid', _userId)
  console.debug('eventid', eventId)

  console.warn('Registration found for user and event registrationId', r?.id)

  const matches = r?.id
    ? await prisma.networkingMatch.findMany({
        where: { registrationId: r.id },
        include: {
          user: {
            select: { id: true, name: true, picture: true, dataCollected: true }
          }
        }
      })
    : []

  const errors = {
    missingProfile: !!r?.user.userDetailedProfile,
    registeredForEvent: !!r,
    matchesJobStatus: r?.id
      ? ((
          await prisma.queueJob.findFirst({
            where: {
              type: JobType.MATCH_MAKING_GENERATION,
              eventId,
              userId: _userId
            }
          })
        )?.status ?? null)
      : null
  }

  console.warn('errors', errors)

  return { matches: parseNetworkingMatches(matches), errors }
}
