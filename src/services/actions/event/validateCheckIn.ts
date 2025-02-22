'use server'

import prisma from '@/lib/prisma'

export const validateCheckIn = async (eventId: string, userId: string) => {
  if (!eventId) return false

  const registrations = await prisma.eventRegistration.findFirst({
    where: { AND: [{ eventId, userId }] },
    include: { tickets: true }
  })

  if (!registrations) return false
  return registrations.tickets.map(_ => !!_.checkedInDate).some(_ => _)
}
