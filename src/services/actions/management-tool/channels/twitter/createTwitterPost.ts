'use server'

import { isOrganizerAdmin } from '@/lib/auth/lucia'
import prisma from '@/lib/prisma'
import { CreatePostTwitterSchema } from '@/schemas/twitterSchema'

export const createTwitterPost = async (input: CreatePostTwitterSchema) => {
  const { userId, accountId, organizationId, content, scheduledDate } = input

  const isAllowed = await isOrganizerAdmin(organizationId, userId)
  if (!isAllowed) {
    throw new Error('Unauthorized: You don´t have permission.')
  }

  try {
    return await prisma.post.create({
      data: {
        userId,
        accountId,
        organizationId,
        content,
        scheduledDate,
        status: 'SCHEDULED',
        createdAt: new Date(),
        postTwitterId: input.postTwitterId || ''
      }
    })
  } catch (error) {
    console.error('Error creating post:', error)
    throw new Error('Failed to create post')
  }
}
