import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'
import WelcomeScreen from '@/components/orgs/WelcomeNewOrg'
import RegistrationChart from '@/components/orgs/RegistrationChart'
import { getNewOrgWelcomeProps } from '@/services/actions/org/getNewOrgWelcomeProps'

export default async function Page({ params }: { params: { id: string } }) {
  const {
    hasContacts,
    hasEvents,
    hasNotifications,
    isStripeSetup,
    hasFirstRegistration
  } = await getNewOrgWelcomeProps(params.id)

  const user = await getUser()

  if (user) {
    if (user.role === Roles.ADMIN) {
      return (
        <>
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
        </>
      )
    } else if (user.role === Roles.NEW_USER) {
      redirect(`/newuser`)
    } else if (user.role === Roles.USER) {
      redirect(`/user`)
    } else if (user.role === Roles.ANDINO_ADMIN) {
      redirect(`/andino-admin`)
    }
  }
}
