'use server'

import { organizationService } from '@/services/organizationService'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { Roles } from '@prisma/client'
import { getUser } from '@/lib/auth/lucia'
import { OrganizationSchema } from '@/schemas/organizerSchema'
import { PublicCommunitySchema } from '@/schemas/communitySchema'
import { AdminOrganizationSchema } from '@/schemas/adminSchema'

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
  }
}

export async function getAllOrganizationsForCurrentUser() {
  const user = await getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const results = await prisma.organizer.findMany({
    where: { userId: user.id },
    include: { organization: true }
  })

  return results.map(org => OrganizationSchema.parse(org.organization))
}

export async function getOrganization(id: string) {
  const org = await prisma.organization.findUnique({
    where: { id }
  })

  if (!org) return null

  return PublicCommunitySchema.parse(org)
}

export async function getAdminOrganization(id: string) {
  const org = await prisma.organization.findUnique({
    where: { id }
  })

  if (!org) return null

  return AdminOrganizationSchema.parse(org)
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
