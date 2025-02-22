'use server'

import prisma from '@/lib/prisma'
import { postTwitterSchema } from '@/schemas/twitterSchema'

export const getTwitterPostsByUserId = async (userId: string) => {
  try {
    const posts = await prisma.post.findMany({
      where: { userId },
      orderBy: {
        scheduledDate: 'asc'
      }
    })

    return posts.map(post => postTwitterSchema.parse(post))
  } catch (error) {
    console.error('Error fetching posts by userId:', error)
    throw new Error('Failed to fetch posts')
  }
}
