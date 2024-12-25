'use server'

import prisma from '@/lib/prisma'
import {
  userDataCollectedShema,
  profileWithPrivacySchema,
  UserDataCollected
} from '@/schemas/userSchema'
import { extractTextFromFile } from '@/lib/data/parser/extractTextFromFile'

import { z } from 'zod'

export async function getCurrentUserProfile(currentUserId: string) {
  try {
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
      role: user.role,
      resumeUrl: dataCollected?.resumeUrl ?? '',
      resumeLastUpdated: dataCollected?.resumeLastUpdated ?? ''
    }

    return profileWithPrivacySchema.parse(cleanUserData)
  } catch (error) {
    console.error('Error in getUserProfile:', error)
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors)
    }
    return null
  }
}
export async function deleteUserAccount(userId: string) {
  try {
    await prisma.session.deleteMany({
      where: { userId: userId }
    })

    await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() }
    })
    return { success: true }
  } catch (error) {
    console.error('Error deleting user:', error)
    return { success: false, error: 'Failed to delete user' }
  }
}

export async function saveNetworkingProfile(
  userId: string,
  formData: UserDataCollected
) {
  try {
    // Get existing user data
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { dataCollected: true }
    })

    const existingData = userDataCollectedShema.parse(
      existingUser?.dataCollected || {}
    )

    // Get the new resume URL and last updated timestamp
    const resumeUrl = formData.resumeUrl as string | null
    const resumeLastUpdated = formData.resumeLastUpdated as string | null

    // Check if we need to extract new text
    let resumeText = existingData.resumeText
    if (
      resumeUrl &&
      resumeLastUpdated &&
      resumeLastUpdated !== existingData.resumeLastUpdated
    ) {
      try {
        const response = await fetch(resumeUrl)
        const fileBlob = await response.blob()
        const file = new File([fileBlob], 'resume', { type: fileBlob.type })
        resumeText = await extractTextFromFile(file)
        console.log(resumeText)
      } catch (error) {
        console.error('Error extracting text:', error)
        // Continue with existing text if extraction fails
      }
    }

    // Prepare new data
    const newData = {
      professionalMotivations: formData.professionalMotivations,
      communicationStyle: formData.communicationStyle,
      professionalValues: formData.professionalValues,
      careerAspirations: formData.careerAspirations,
      significantChallenge: formData.significantChallenge,
      resumeUrl,
      resumeText,
      resumeLastUpdated
    }

    // Merge with existing data
    const mergedData = {
      ...(existingData as Record<string, unknown>),
      ...newData
    }

    const validatedData = userDataCollectedShema.parse(mergedData)

    await prisma.user.update({
      where: { id: userId },
      data: {
        dataCollected: validatedData
      }
    })

    // this triggers the AI profile builder cron job.
    // if u developing locally u will have to trigger it manually by going to the route using browser.
    await prisma.queueJob.create({
      data: {
        type: 'COLLECT_USER_DATA',
        data: { userId },
        priority: 1
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Error in saveNetworkingProfile:', error)
    return { error: 'Failed to save networking profile' }
  }
}
