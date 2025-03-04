'use server'

import { isOrganizerAdmin } from '@/lib/auth/lucia'
import prisma from '@/lib/prisma'
import { deletePublishedPost } from '@/lib/twitter/deletePublishedPosts'

export const deleteTwitterPost = async (
  postId: number,
  userId: string,
  organizationId: string,
  postTwitterId?: string
) => {
  const isAllowed = await isOrganizerAdmin(organizationId, userId)
  if (!isAllowed) {
    throw new Error('Unauthorized: You don’t have permission.')
  }

  try {
    if (postTwitterId) {
      return await deletePublishedPost(postTwitterId)
    }

    return await prisma.post.delete({ where: { id: postId } })
  } catch (error) {
    console.error('Error deleting post:', error)
    throw new Error('Failed to delete post')
  }
}
