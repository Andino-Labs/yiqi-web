'use server'

import prisma from '@/lib/prisma'

import { EventRegistrationSchema } from '@/schemas/eventSchema'
import { getUser, isOrganizerAdmin } from '@/lib/auth/lucia'
import { getEvent } from './event/getEvent'
import { checkInEventTicket } from '@/lib/organizations/checkInEventTicket'

export async function deleteEvent(eventId: string) {
  const event = await getEvent({ eventId })
  if (!event) throw new Error('Event not found')

  const currentUser = await getUser()
  if (
    !currentUser ||
    !(await isOrganizerAdmin(event.organizationId, currentUser.id))
  ) {
    throw new Error('Unauthorized')
  }

  await prisma.event.update({
    where: { id: eventId },
    data: { deletedAt: new Date() }
  })
}

export async function getUserRegistrationStatus(
  eventId: string,
  userId: string
) {
  const attendee = await prisma.eventRegistration.findUnique({
    where: {
      eventId_userId: {
        eventId,
        userId
      }
    }
  })
  return attendee ? true : false
}

export async function getEventRegistrations(eventId: string) {
  const registrations = await prisma.eventRegistration.findMany({
    where: { eventId },
    include: {
      user: true,
      tickets: { include: { ticketType: true } }
    }
  })

  return registrations.map(registration =>
    EventRegistrationSchema.parse(registration)
  )
}

export async function getEventRegistrationsByUserId(userId: string) {
  const registrations = await prisma.eventRegistration.findMany({
    where: { userId },
    include: {
      event: true,
      user: true
    }
  })

  return registrations.map(registration =>
    EventRegistrationSchema.parse(registration)
  )
}

export async function checkInUserToEvent(eventId: string, ticketId: string) {
  const currentUser = await getUser()
  if (!currentUser) {
    throw new Error('Unauthorized')
  }
  return checkInEventTicket(eventId, ticketId, currentUser.id)
}
