import { getOrganization } from '@/services/actions/organizationActions'
import { getUser } from '@/lib/auth/lucia'
import OrganizationLayout from '@/components/orgs/OrganizationLayout'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'

import { getOrganizationEvents } from '@/services/actions/event/getOrganizationEvents'
import { getTranslations } from 'next-intl/server'
import EventSection from '@/components/EventSection'

export default async function EventsPage({
  params
}: {
  params: { id: string }
}) {
  const t = await getTranslations('contactFor')
  const organization = await getOrganization(params.id)
  const user = await getUser()
  const events = await getOrganizationEvents(params.id)

  if (!organization) {
    return <div>{t('organizationNotFound')}</div>
  }

  if (!user) {
    redirect(`/auth`)
  }

  if (user.role === Roles.ADMIN) {
    return (
      <main className="flex flex-col items-center justify-center">
        <OrganizationLayout
          orgId={params.id}
          userProps={{
            id: user.id,
            picture: user.picture!,
            email: user.email,
            name: user.name
          }}
        >
          {/* Pasar los datos al Client Component */}
          <EventSection events={events} orgId={params.id} />
        </OrganizationLayout>
      </main>
    )
  } else if (user.role === Roles.NEW_USER) {
    redirect(`/newuser`)
  } else if (user.role === Roles.USER) {
    redirect(`/user`)
  }
}
