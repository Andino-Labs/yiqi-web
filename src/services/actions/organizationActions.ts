'use server'

import { organizationService } from '@/services/organizationService'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { Roles } from '@prisma/client'

export async function createOrganization(
  data: Parameters<typeof organizationService.create>[0],
  userId: string
) {
  const currentUser = await prisma.user.findUnique({
    where: { id: userId }
  })
  if (!currentUser) throw new Error('Unauthorized')

  try {
    const org = await organizationService.create(data)

    await prisma.organizer.create({
      data: {
        userId: currentUser.id,
        organizationId: org.id,
        role: Roles.ADMIN
      }
    })

    await prisma.user.update({
      where: { id: userId },
      data: { role: Roles.ADMIN }
    })

    await prisma.organization.update({
      where: { id: org.id },
      data: { userId: userId }
    })
  } catch (error) {
    throw new Error(`${error}`)
  } finally {
    revalidatePath('/', 'layout')
  }
}

export async function getAllOrganizations() {
  return organizationService.getAll()
}

export async function getOrganization(id: string) {
  return await prisma.organization.findUnique({
    where: { id }
  })
}

export async function updateOrganization(
  id: string,
  data: Parameters<typeof organizationService.update>[1],
  userId: string
) {
  const currentUser = await prisma.user.findUnique({
    where: { id: userId }
  })
  if (!currentUser || currentUser.role !== Roles.ADMIN) {
    throw new Error('Unauthorized')
  }
  try {
    await organizationService.update(id, data, currentUser.id)
  } catch (error) {
    throw new Error(`${error}`)
  } finally {
    revalidatePath('/', 'layout')
  }
}

export async function deleteOrganization(id: string, userId: string) {
  const currentUser = await prisma.user.findUnique({
    where: { id: userId }
  })
  if (!currentUser || currentUser.role !== Roles.ADMIN) {
    throw new Error('Unauthorized')
  }
  try {
    await organizationService.delete(id)
  } catch (error) {
    throw new Error(`${error}`)
  } finally {
    revalidatePath('/', 'layout')
  }
}
