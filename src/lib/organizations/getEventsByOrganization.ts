import { getOrganizationEvents } from '@/services/actions/event/getOrganizationEvents'
import prisma from '@/lib/prisma'

export async function getEventsByOrganization(
  organizationId: string,
  userId: string
) {
  const hasPermessions = await prisma.organizer.findFirst({
    where: { userId, organizationId }
  })
  if (!hasPermessions) {
    throw new Error('Unauthorized: not allowed')
  }
  const results = await getOrganizationEvents(organizationId)
  return results
}
