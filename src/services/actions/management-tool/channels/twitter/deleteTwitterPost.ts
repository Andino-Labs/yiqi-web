'use server'

import prisma from '@/lib/prisma'

export const deleteTwitterPost = async (postId: number) => {
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
