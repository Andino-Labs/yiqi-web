'use server'

import prisma from '@/lib/prisma'
import {
  organizationEventSchema,
  OrganizationEventSchemaType
} from '@/schemas/eventSchema'

export async function getOrganizationEvents(
  organizationId: string
): Promise<OrganizationEventSchemaType[]> {
  const events = await prisma.event.findMany({
    where: {
      organizationId,
      deletedAt: null
    },
    orderBy: { startDate: 'desc' }
  })

  return events.map(event => organizationEventSchema.parse(event))
}
