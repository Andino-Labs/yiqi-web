import { OrganizationSchema } from '@/services/organizationService'
import prisma from '@/lib/prisma'
import { z } from 'zod'

export async function getOrganizationsByUser(userId: string) {
  const results = await prisma.organizer.findMany({
    where: { userId },
    include: { organization: true }
  })

  return results.map(org =>
    OrganizationSchema.extend({ id: z.string() }).parse(org.organization)
  )
}
