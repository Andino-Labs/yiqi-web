'use server'

import { isOrganizerAdmin } from '@/lib/auth/lucia'
import prisma from '@/lib/prisma'
import { dataTwitterSchema } from '@/schemas/twitterSchema'

export const getTwitterAccountByUserId = async (
  userId: string,
  organizationId: string
) => {
  const isAllowed = await isOrganizerAdmin(organizationId, userId)
  if (!isAllowed) {
    throw new Error('Unauthorized: You don´t have permission.')
  }

  try {
    const twitterAccount = await prisma.twitterAccount.findFirst({
      where: {
        userId: userId
      }
    })

    return dataTwitterSchema.parse(twitterAccount)
  } catch (error) {
    console.error('Error fetching Twitter account:', error)
    return null
  }
}
