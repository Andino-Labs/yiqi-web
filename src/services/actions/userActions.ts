'use server'

import prisma from '@/lib/prisma'
import { Roles } from '@prisma/client'
import { getUser } from '@/lib/auth/lucia'
import { ProfileWithPrivacy } from '@/schemas/userSchema'

import { z } from 'zod'
import { fetchAndFormatUserProfile } from '@/lib/user/fetchAndFormatUserProfile'
import { deleteUser } from '@/lib/user/deleteUser'
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
  }
}

export async function updateUserProfile(data: ProfileWithPrivacy) {
  try {
    const {
      id,
      picture,
      name,
      phoneNumber,
      stopCommunication,
      email,
      privacySettings,
      ...socialData
    } = data

    const currentUser = await prisma.user.findUnique({
      where: { id: id },
      select: {
        dataCollected: true,
        privacySettings: true
      }
    })

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        name,
        phoneNumber,
        stopCommunication,
        picture,
        email,
        privacySettings,
        dataCollected: {
          ...(currentUser?.dataCollected as Record<string, unknown>),
          ...socialData
        }
      }
    })
    return { success: true, user: updatedUser }
  } catch (error) {
    console.error('Error updating profile:', error)
    throw new Error('Failed to update profile')
  }
}

export async function getUserProfile(currentUserId: string) {
  try {
    const userCurrent = await getUser()
    if (!userCurrent?.id) return null
    return await fetchAndFormatUserProfile(
      currentUserId,
      userCurrent?.id === currentUserId
    )
  } catch (error) {
    console.error('Error in getUserProfile:', error)
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors)
    }

    return null
  }
}

export async function deleteUserAccount() {
  try {
    const userCurrent = await getUser()
    if (!userCurrent?.id) return { success: false, error: 'User not found' }

    return await deleteUser(userCurrent.id)
  } catch (error) {
    console.error('Error deleting user:', error)
    return { success: false, error: 'Failed to delete user' }
  }
}
