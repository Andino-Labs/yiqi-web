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

  return updatedRegistration
}
