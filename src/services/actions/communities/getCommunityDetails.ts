'use server'

import { userSchema } from '@/schemas/userSchema'
import { PublicCommunitySchema } from '@/schemas/communitySchema'
import { getOrganizationContacts } from '../contactActions'
import { getOrganizationEvents } from '../event/getOrganizationEvents'
import { getOrganization } from '../organizationActions'
import { getOrganizersByOrganization } from '../organizerActions'

export default async function getCommunityDetails(communityId: string) {
  const [organization, events, members, organizers] = await Promise.all([
    getOrganization(communityId),
    getOrganizationEvents(communityId),
    getOrganizationContacts(communityId),
    getOrganizersByOrganization(communityId)
  ])

  return {
    organization: PublicCommunitySchema.parse(organization),
    events: events,
    members: members,
    organizers: organizers.map(el => userSchema.parse(el.user))
  }
}
