'use server'

import prisma from '@/lib/prisma'

export async function deleteEvent(eventId: string) {
  await prisma.event.update({
    where: { id: eventId },
    data: { deletedAt: new Date().toISOString() }
  })
}
