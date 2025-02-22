'use server'

import prisma from '@/lib/prisma'
import { SavedEventSchema } from '@/schemas/eventSchema'
import { addMinutes } from 'date-fns'

export async function getUserOngoingEvent(email?: string) {
  if (!email) return null

  const now = new Date()
  const minutesAfter = addMinutes(now, 20)

  try {
    const eventRegistration = await prisma.eventRegistration.findFirst({
      where: {
        user: {
          email: email.toLowerCase()
        },
        event: {
          OR: [
            {
              // Match events starting in the next 20 minutes
              startDate: { gte: now, lte: minutesAfter }
            },
            {
              // Match ongoing events
              startDate: { lte: now },
              endDate: { gte: now }
            }
          ]
        }
      },
      include: {
        user: true,
        event: true
      }
    })

    return eventRegistration?.event
      ? SavedEventSchema.parse(eventRegistration.event)
      : null
  } catch (error) {
    console.error('Error fetching user event:', error)
    return null
  }
}
