'use server'

import { AddTwitterAccountSchema } from '@/schemas/twitterSchema'
import prisma from '@/lib/prisma'
import { isOrganizerAdmin } from '@/lib/auth/lucia'

export const createTwitterAccount = async ({
  userId,
  screenName,
  userIdApp,
  accessToken,
  refreshToken,
  organizationId,
  expiresIn,
}: AddTwitterAccountSchema) => {
  const isAllowed = await isOrganizerAdmin(organizationId, userIdApp)
  if (!isAllowed) {
    throw new Error('Unauthorized: You don´t have permission.')
  }

  try {
    return await prisma.twitterAccount.create({
      data: {
        userId: userIdApp,
        accountUsername: screenName,
        organizationId,
        accountId: userId,
        accessToken,
        refreshToken,
        expiresIn
      }
    })
  } catch (error) {
    console.error('Error creating Twitter account:', error)
    return { success: false, error: 'Error creating Twitter account.' }
  }
}
