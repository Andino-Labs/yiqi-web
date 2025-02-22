'use server'

import { AddTwitterAccountSchema } from '@/schemas/twitterSchema'
import prisma from '@/lib/prisma'

export const createTwitterAccount = async ({
  userId,
  screenName,
  userIdApp,
  accessToken,
  accessTokenSecret,
  organizationId
}: AddTwitterAccountSchema) => {
  try {
    return await prisma.twitterAccount.create({
      data: {
        userId: userIdApp,
        accountUsername: screenName,
        organizationId,
        accountId: userId,
        accessToken,
        accessTokenSecret
      }
    })
  } catch (error) {
    console.error('Error creating Twitter account:', error)
    return { success: false, error: 'Error creating Twitter account.' }
  }
}
