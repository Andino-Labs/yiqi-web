'use server'

import { getUser, isOrganizerAdmin } from '@/lib/auth/lucia'
import prisma from '@/lib/prisma'
import { AttendeeStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const updateAttendeeTicketsByStatus = async (
  eventId: string,
  userId: string,
  attendeeStatus: AttendeeStatus
) => {
  const ticketOfferings = await prisma.ticketOfferings.findMany({
    where: { eventId },
    select: { id: true }
  })

  await prisma.ticket.updateMany({
    where: {
      AND: [
        { userId },
        { ticketTypeId: { in: ticketOfferings.map(_ => _.id) } }
      ]
    },
    data: { deletedAt: attendeeStatus === 'APPROVED' ? null : new Date() }
  })
}

export async function updateRegistrationStatus(
  registrationId: string,
  status: 'APPROVED' | 'REJECTED'
) {
  try {
    const currentUser = await getUser()
    const registration = await prisma.eventRegistration.findUnique({
      where: { id: registrationId },
      include: { event: true }
    })

    if (!registration) throw new Error('Registration not found')

    if (
      !currentUser ||
      !(await isOrganizerAdmin(
        registration.event.organizationId,
        currentUser.id
      ))
    ) {
      throw new Error('Unauthorized')
    }

    const updatedRegistration = await prisma.eventRegistration.update({
      where: { id: registrationId },
      data: { status }
    })

    await updateAttendeeTicketsByStatus(
      registration.eventId,
      registration.userId,
      status
    )

    if (status === 'APPROVED') {
      await prisma.queueJob.create({
        data: {
          type: 'SEND_USER_MESSAGE',
          data: {
            userId: registration.userId,
            eventId: registration.eventId
          },
          notificationType: 'RESERVATION_CONFIRMED',
          userId: registration.userId,
          eventId: registration.eventId
        }
      })
    }

    return updatedRegistration
  } catch (error) {
    throw new Error(`${JSON.stringify(error, null, 2)}`)
  } finally {
    revalidatePath('/', 'layout')
  }
}
