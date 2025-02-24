'use server'

import prisma from '@/lib/prisma'
import { postTwitterSchema } from '@/schemas/twitterSchema'

export const getTwitterPostsByUserId = async (
  userId?: string,
  accountId?: string
) => {
  try {
    const filter = userId ? { userId } : accountId ? { accountId } : {}

    const posts = await prisma.post.findMany({
      where: filter,
      orderBy: {
        scheduledDate: 'asc'
      }
    })

    return posts.map(post => postTwitterSchema.parse(post))
  } catch (error) {
    console.error('Error fetching posts:', error)
    throw new Error('Failed to fetch posts')
  }
}
