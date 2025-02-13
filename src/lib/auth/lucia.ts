'use server'

import { cookies } from 'next/headers'
import { lucia } from './lib'
import prisma from '../prisma'
import { OrganizerRole } from '@prisma/client'
import { luciaUserSchema } from '@/schemas/userSchema'

export const getUser = async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value || null
  if (!sessionId) {
    return null
  }

  const { session, user } = await lucia.validateSession(sessionId)

  if (!user || !session || !user.id) {
    return null
  }

  try {
    if (session && session.fresh) {
      const sessionCookie = await lucia.createSessionCookie(session.id)
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      )
    }
    if (!session) {
      const sessionCookie = await lucia.createBlankSessionCookie()
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      )
    }
  } catch (error) {
    console.error(error)
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user?.id
    },
    select: {
      id: true,
      name: true,
      email: true,
      picture: true,
      role: true,
      dataCollected: true,
      userContentPreferences: true,
      userDetailedProfile: true,
      userEmbeddableProfile: true
    }
  })

  if (!dbUser) {
    return null
  }

  return luciaUserSchema.parse(dbUser)
}
export async function isEventAdmin(
  eventId: string,
  userId: string
): Promise<boolean> {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      organization: {
        include: {
          organizers: {
            where: {
              userId: userId,
              role: OrganizerRole.ADMIN
            }
          }
        }
      }
    }
  })

  if (event && event.organization && event.organization.organizers) {
    return event.organization.organizers.length > 0
  }
  return false
}

export async function isOrganizerAdmin(
  orgId: string,
  userId: string
): Promise<boolean> {
  const organizer = await prisma.organizer.findFirst({
    where: {
      organizationId: orgId,
      userId: userId,
      role: OrganizerRole.ADMIN
    }
  })

  return organizer !== null
}
