'use server'

import prisma from '@/lib/prisma'
import { Roles } from '@prisma/client'
import { getUser } from '@/lib/auth/lucia'
import {
  ProfileWithPrivacy,
  profileWithPrivacySchema,
  UserDataCollected
} from '@/schemas/userSchema'

import { z } from 'zod'
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
    const user = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: {
        id: true,
        name: true,
        email: true,
        picture: true,
        phoneNumber: true,
        stopCommunication: true,
        dataCollected: true,
        privacySettings: true,
        linkedinAccessToken: true,
        role: true
      }
    })

    if (!user) return null
    const dataCollected = user.dataCollected as UserDataCollected
    const cleanUserData = {
      id: user.id,
      name: user.name ?? '',
      picture: user.picture ?? '',
      stopCommunication: user.stopCommunication ?? false,
      company: dataCollected?.company ?? '',
      position: dataCollected?.position ?? '',
      shortDescription: dataCollected?.shortDescription ?? '',
      isLinkedinLinked: !!user.linkedinAccessToken,
      privacySettings: user.privacySettings,
      phoneNumber: user.phoneNumber ?? '',
      linkedin: dataCollected?.linkedin ?? '',
      email: user.email ?? '',
      x: dataCollected?.x ?? '',
      instagram: dataCollected?.instagram ?? '',
      website: dataCollected?.website ?? '',
      professionalMotivations: dataCollected?.professionalMotivations ?? '',
      communicationStyle: dataCollected?.communicationStyle ?? '',
      professionalValues: dataCollected?.professionalValues ?? '',
      careerAspirations: dataCollected?.careerAspirations ?? '',
      significantChallenge: dataCollected?.significantChallenge ?? '',
      role: user.role
    }

    if (currentUserId == userCurrent.id) {
      return profileWithPrivacySchema.parse(cleanUserData)
    } else {
      return profileWithPrivacySchema.parse({
        id: user.id,
        name: user.name ?? '',
        picture: user.picture ?? '',
        stopCommunication: user.stopCommunication ?? false,
        company: dataCollected?.company ?? '',
        position: dataCollected?.position ?? '',
        shortDescription: dataCollected?.shortDescription ?? '',
        role: user.role,
        ...filterProfileData(cleanUserData as unknown as User)
      })
    }
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

    // Eliminar todas las sesiones asociadas al usuario
    await prisma.session.deleteMany({
      where: { userId: userCurrent.id }
    })

    // Eliminar la cuenta del usuario
    await prisma.user.update({
      where: { id: userCurrent.id },
      data: { deletedAt: new Date() }
    })
    return { success: true }
  } catch (error) {
    console.error('Error deleting user:', error)
    return { success: false, error: 'Failed to delete user' }
  }
}

interface User {
  id: string
  [key: string]: string | number | boolean | Record<string, boolean> | undefined
  privacySettings: {
    [key: string]: boolean
  }
}

export const filterProfileData = (user: User): Partial<User> => {
  if (!user || !user.privacySettings) {
    throw new Error('Invalid user data or missing privacy settings')
  }

  const filteredData: Partial<User> = {}

  Object.keys(user.privacySettings).forEach(key => {
    if (user.privacySettings[key] && key in user) {
      filteredData[key] = user[key]
    }
  })

  return filteredData
}
