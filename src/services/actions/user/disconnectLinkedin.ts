'use server'

import { getUser } from '@/lib/auth/lucia'
import prisma from '@/lib/prisma'

export async function disconnectLinkedin() {
  const user = await getUser()

  if (!user) {
    return { success: false, error: 'User not found' }
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { linkedinAccessToken: null }
  })

  return { success: true }
}
