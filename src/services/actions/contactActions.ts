'use server'

import { getUser, isOrganizerAdmin } from '@/lib/auth/lucia'
import prisma from '@/lib/prisma'

export async function getOrganizationContacts(organizationId: string) {
  const contacts = await prisma.eventRegistration.findMany({
    where: {
      event: { organizationId }
    },
    include: {
      user: true,
      event: true
    },
    distinct: ['userId']
  })

  return contacts
}

export async function getContactDetails(
  userId: string,
  organizationId: string
) {
  const contact = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      registeredEvents: {
        where: { event: { organizationId } },
        include: { event: true }
      }
    }
  })

  return contact
}

export async function getEventAttendees(eventId: string) {
  const attendees = await prisma.eventRegistration.findMany({
    where: { eventId },
    include: { user: true }
  })

  return attendees
}

export async function updateAttendeeStatus(
  attendeeId: string,
  status: 'APPROVED' | 'REJECTED'
) {
  const currentUser = await getUser()
  const attendee = await prisma.eventRegistration.findUnique({
    where: { id: attendeeId },
    include: { event: true }
  })

  if (!attendee) throw new Error('Attendee not found')

  if (
    !currentUser ||
    !(await isOrganizerAdmin(attendee.event.organizationId, currentUser.id))
  ) {
    throw new Error('Unauthorized')
  }

  const updatedAttendee = await prisma.eventRegistration.update({
    where: { id: attendeeId },
    data: { status }
  })

  return updatedAttendee
}

export async function isUserOrganizationAdmin(
  userId: string,
  organizationId: string
) {
  const membership = await prisma.organizer.findFirst({
    where: {
      userId,
      organizationId,
      role: 'ADMIN'
    }
  })
  return !!membership
}
