import prisma from '@/lib/prisma'
import { z } from 'zod'

export const OrganizationSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  logo: z.string().url({ message: 'Invalid URL' }).optional(),
  colour: z.string().min(1, { message: 'Colour is required' }),
  facebook: z
    .string()
    .url({ message: 'Invalid URL' })
    .optional()
    .or(z.literal('')),
  instagram: z
    .string()
    .url({ message: 'Invalid URL' })
    .optional()
    .or(z.literal('')),
  tiktok: z
    .string()
    .url({ message: 'Invalid URL' })
    .optional()
    .or(z.literal('')),
  linkedin: z
    .string()
    .url({ message: 'Invalid URL' })
    .optional()
    .or(z.literal('')),
  website: z
    .string()
    .url({ message: 'Invalid URL' })
    .optional()
    .or(z.literal(''))
})

const UpdateOrganizationSchema = OrganizationSchema.partial()

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
