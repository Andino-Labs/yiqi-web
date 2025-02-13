import { getOrganization } from '@/services/actions/organizationActions'
import CommunityTab from '@/components/communities/CommunityTab/CommunityTab'
import CommunityBanner from '@/components/communities/CommunityBanner/CommunityBanner'
import { getOrganizationEvents } from '@/services/actions/event/getOrganizationEvents'
import { getOrganizationContacts } from '@/services/actions/contactActions'
import { getOrganizersByOrganization } from '@/services/actions/organizerActions'
import MainLandingNav from '@/components/mainLanding/mainNav'
import { getUser } from '@/lib/auth/lucia'
import { getTranslations } from 'next-intl/server'

export default async function CommunityDetail({
  params
}: {
  params: { id: string }
}) {
  const t = await getTranslations('Community')
  const user = await getUser()

  const [organization, events, members, organizers] = await Promise.all([
    getOrganization(params.id),
    getOrganizationEvents(params.id),
    getOrganizationContacts(params.id),
    getOrganizersByOrganization(params.id)
  ])

  const description = organization?.description || 'No description available'

  const navItems = [`${t('navigationAbout')}`, `${t('navigationMembers')}`]

  return (
    <div className="flex flex-col min-h-screen bg-black pt-10">
      <MainLandingNav user={user!} />
      <div className="max-w-5xl mx-auto w-full px-4 py-8 bg-[#111827] m-10 rounded-lg">
        <CommunityBanner
          organization={organization!}
          organizers={organizers}
          members={members}
        />
        <CommunityTab
          navItems={navItems}
          description={description}
          events={events}
          members={members}
          organizers={organizers}
        />
      </div>
    </div>
  )
}
