'use server'

import {
  CreateOrgContactType,
  createOrgContactSchema
} from '@/schemas/userSchema'
import prisma from './prisma'
import { getUser, isOrganizerAdmin } from './auth/lucia'
import { User } from '@prisma/client'

export default async function createOrgContact(
  orgId: string,
  userData: CreateOrgContactType
) {
  const currentUser = await getUser()
  if (!currentUser) {
    throw new Error('User not found')
  }

  const isAdmin = await isOrganizerAdmin(orgId, currentUser.id)
  if (!isAdmin) {
    throw new Error('User is not an admin')
  }

  const {
    id,
    picture,
    name,
    phoneNumber,
    stopCommunication,
    email,
    privacySettings,
    ...socialData
  } = userData

  let userToSave: User
  if (id) {
    userToSave = await prisma.user.findUniqueOrThrow({
      where: { id: id }
    })
    userToSave = await prisma.user.update({
      where: { id: id },
      data: {
        name,
        phoneNumber,
        stopCommunication,
        picture,
        email,
        privacySettings,
        dataCollected: {
          ...(userToSave?.dataCollected as Record<string, unknown>),
          ...socialData
        }
      }
    })
  } else {
    userToSave = await prisma.user.create({
      data: {
        picture,
        name,
        phoneNumber,
        stopCommunication,
        email,
        privacySettings,
        dataCollected: {
          ...socialData
        }
      }
    })
  }

  await prisma.organizationContact.create({
    data: {
      organizationId: orgId,
      userId: userToSave.id
    }
  })

  return createOrgContactSchema.parse({
    ...userToSave,
    ...(userToSave.dataCollected as Record<string, unknown>)
  })
}
