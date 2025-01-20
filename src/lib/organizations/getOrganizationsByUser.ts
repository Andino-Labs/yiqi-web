import { SavedOrganizationSchema } from '@/schemas/organizationSchema'
import prisma from '@/lib/prisma'

export async function getOrganizationsByUser(
  userId: string,
  withEventCount = false
) {
  const results = await prisma.organizer.findMany({
    where: { userId },
    include: { organization: true }
  })

  let eventCounts: Record<string, number> = {}
  if (withEventCount) {
    const orgIds = results.map(org => org.organization.id)

    const counts = await prisma.event.count({
      where: {
        organizationId: {
          in: orgIds
        }
      }
    })

    eventCounts = results.reduce(
      (acc, org) => {
        acc[org.organization.id] = counts
        return acc
      },
      {} as Record<string, number>
    )
  }

  // Return the organizations with event counts
  return results.map(org => {
    const eventCount = withEventCount
      ? eventCounts[org.organization.id] || 0
      : 0

    const organizationWithCount = {
      ...org.organization,
      eventCount
    }

    return SavedOrganizationSchema.parse(organizationWithCount)
  })
}
