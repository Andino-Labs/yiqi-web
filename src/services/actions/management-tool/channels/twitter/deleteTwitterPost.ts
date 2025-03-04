'use server'

import { isOrganizerAdmin } from '@/lib/auth/lucia'
import prisma from '@/lib/prisma'

export const deleteTwitterPost = async (
  postId: number,
  userId: string,
  organizationId: string
) => {
  const isAllowed = await isOrganizerAdmin(organizationId, userId)
  if (!isAllowed) {
    throw new Error('Unauthorized: You don´t have permission.')
  }

  try {
    const deletedPost = await prisma.post.delete({
      where: { id: postId }
    })

    return deletedPost
  } catch (error) {
    console.error('Error deleting post:', error)
    throw new Error('Failed to delete post')
  }
}
