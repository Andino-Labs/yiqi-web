'use server'

import { isOrganizerAdmin } from '@/lib/auth/lucia'
import prisma from '@/lib/prisma'
import { UpdatePostTwitterSchema } from '@/schemas/twitterSchema'

export const updateTwitterPost = async (input: UpdatePostTwitterSchema) => {
  const { postId, content, scheduledDate, status, userId, organizationId } =
    input

  const isAllowed = await isOrganizerAdmin(organizationId, userId)
  if (!isAllowed) {
    throw new Error('Unauthorized: You don´t have permission.')
  }

  try {
    return await prisma.post.update({
      where: { id: postId },
      data: {
        ...(content && { content }),
        ...(scheduledDate && { scheduledDate }),
        ...(status && { status })
      }
    })
  } catch (error) {
    console.error('Error updating post:', error)
    throw new Error('Failed to update post')
  }
}
