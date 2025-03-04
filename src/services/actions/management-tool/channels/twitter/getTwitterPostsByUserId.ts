'use server'

import prisma from '@/lib/prisma'
import { postTwitterSchema } from '@/schemas/twitterSchema'

export const getTwitterPostsByOrganizationId = async (
  organizationId: string
) => {
  try {
    const posts = await prisma.post.findMany({
      where: { organizationId },
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
