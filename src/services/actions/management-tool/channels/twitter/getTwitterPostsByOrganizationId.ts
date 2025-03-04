'use server'

import { isOrganizerAdmin } from '@/lib/auth/lucia'
import prisma from '@/lib/prisma'
import { postTwitterSchema } from '@/schemas/twitterSchema'

export const getTwitterPostsByOrganizationId = async (
  organizationId: string, userId: string
) => {

  const isAllowed = await isOrganizerAdmin(organizationId, userId)
  if (!isAllowed) {
    throw new Error('Unauthorized: You don´t have permission.')
  }

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
