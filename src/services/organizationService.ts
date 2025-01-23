import prisma from '@/lib/prisma'
import {
  OrganizationSchema,
  UpdateOrganizationSchema
} from '@/schemas/organizationSchema'
import { z } from 'zod'

export const organizationService = {
  create: async (data: z.infer<typeof OrganizationSchema>) => {
    const validatedData = OrganizationSchema.parse(data)
    return prisma.organization.create({ data: validatedData })
  },

  getAll: async () => {
    return prisma.organization.findMany()
  },

  getById: async (id: string) => {
    return prisma.organization.findUnique({ where: { id } })
  },

  update: async (
    id: string,
    data: z.infer<typeof UpdateOrganizationSchema>,
    userId: string
  ) => {
    const validatedData = UpdateOrganizationSchema.parse(data)

    const organizer = await prisma.organizer.findFirst({
      where: { organizationId: id, userId: userId }
    })

    if (!organizer) {
      throw new Error(
        'Unauthorized: User is not an organizer for this organization'
      )
    }

    return prisma.organization.update({ where: { id }, data: validatedData })
  },

  delete: async (id: string) => {
    return prisma.organization.update({
      where: { id },
      data: { deletedAt: new Date() }
    })
  }
}
