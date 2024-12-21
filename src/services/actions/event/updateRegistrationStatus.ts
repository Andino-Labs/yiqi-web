'use server'

import { getUser, isOrganizerAdmin } from '@/lib/auth/lucia'
import prisma from '@/lib/prisma'

export async function updateRegistrationStatus(
  registrationId: string,
  status: 'APPROVED' | 'REJECTED'
) {
  const currentUser = await getUser()
  const registration = await prisma.eventRegistration.findUnique({
    where: { id: registrationId },
    include: { event: true }
  })

  if (!registration) throw new Error('Registration not found')

  if (
    !currentUser ||
    !(await isOrganizerAdmin(registration.event.organizationId, currentUser.id))
  ) {
    throw new Error('Unauthorized')
  }

  const updatedRegistration = await prisma.eventRegistration.update({
    where: { id: registrationId },
    data: { status }
  })

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
}
