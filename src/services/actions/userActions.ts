'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Roles } from '@prisma/client'

export async function searchUsers(query: string) {
  return prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } }
      ]
    },
    take: 5
  })
}

export async function makeRegularUser(user: { userId: string }) {
  try {
    await prisma.user.update({
      where: {
        id: user.userId
      },
      data: {
        role: Roles.USER
      }
    })
  } catch (error) {
    throw new Error(`${error}`)
  } finally {
    revalidatePath('/', 'layout')
  }
}
