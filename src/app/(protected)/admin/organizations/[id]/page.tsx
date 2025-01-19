import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'
import { getOrganization } from '@/services/actions/organizationActions'

import OrganizationLayout from '@/components/orgs/OrganizationLayout'
import WelcomeScreen from '@/components/orgs/WelcomeNewOrg'
import RegistrationChart from '@/components/orgs/RegistrationChart'
import { getNewOrgWelcomeProps } from '@/services/actions/org/getNewOrgWelcomeProps'
import { getTranslations } from 'next-intl/server'

export default async function Page({ params }: { params: { id: string } }) {
  const t = await getTranslations('contactFor')
  const organization = await getOrganization(params.id)
  if (!organization) {
    return <div>{t('organizationNotFound')}</div>
  }
  const {
    hasContacts,
    hasEvents,
    hasNotifications,
    isStripeSetup,
    hasFirstRegistration
  } = await getNewOrgWelcomeProps(params.id)

  const user = await getUser()

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
            picture: user.picture,
            email: user.email,
            name: user.name
          }}
        >
          {!hasFirstRegistration ? (
            <WelcomeScreen
              importedContacts={hasContacts}
              paymentsIsSetup={isStripeSetup}
              eventCreated={hasEvents}
              notificationsSent={hasNotifications}
              orgId={params.id}
            />
          ) : (
            <div className="w-full max-w-5xl mx-auto space-y-8 p-8">
              <RegistrationChart organizationId={params.id} />
            </div>
          )}
        </OrganizationLayout>
      </main>
    )
  } else if (user.role === Roles.NEW_USER) {
    redirect(`/newuser`)
  } else if (user.role === Roles.USER) {
    redirect(`/user`)
  } else if (user.role === Roles.ANDINO_ADMIN) {
    redirect(`/andino-admin`)
  }
}
