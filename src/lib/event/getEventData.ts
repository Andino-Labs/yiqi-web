import { getOrganization } from '@/services/actions/organizationActions'
import { getUser, isOrganizerAdmin } from '@/lib/auth/lucia'
import { SavedEventSchema } from '@/schemas/eventSchema'
import { getEvent } from '@/services/actions/event/getEvent'

export async function getEventData(organizationId: string, eventId: string) {
  const [organization, event, currentUser] = await Promise.all([
    getOrganization(organizationId),
    getEvent(eventId),
    getUser()
  ])

  if (!event) {
    return { notFound: true }
  }

  const isAdmin =
    currentUser && (await isOrganizerAdmin(organizationId, currentUser.id))

  return { organization, event: SavedEventSchema.parse(event), isAdmin }
}
