'use server'

import prisma from '@/lib/prisma'
import { networkingMatchesSchema } from '@/schemas/networkingMatchSchema'

export const getNetworkingMatches = async (registrationId: string) => {
  const matches = await prisma.networkingMatch.findMany({
    where: { registrationId },
    include: { user: { select: { id: true, name: true, picture: true } } }
  })

  return networkingMatchesSchema.parse(matches)
}
