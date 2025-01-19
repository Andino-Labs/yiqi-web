'use server'

import prisma from '@/lib/prisma'

export const saveNetworkingMatch = async (match: {
  userId: string
  eventId: string
  registrationId: string
  personDescription: string
  matchReason: string
}) => {
  await prisma.networkingMatch.create({ data: match })
}
