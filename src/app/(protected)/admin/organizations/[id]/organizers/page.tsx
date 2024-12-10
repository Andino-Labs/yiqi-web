import { getOrganization } from '@/services/actions/organizationActions'
import { getOrganizersByOrganization } from '@/services/actions/organizerActions'
import AddOrganizerButton from './AddOrganizerButton'
import OrganizationLayout from '@/components/orgs/OrganizationLayout'
import { getUser } from '@/lib/auth/lucia'
import { getTranslations } from 'next-intl/server'

export default async function OrganizersPage({
  params
}: {
  params: { id: string }
}) {
  const user = await getUser()
  const organization = await getOrganization(params.id)
  const organizers = await getOrganizersByOrganization(params.id)

  const t = await getTranslations('DeleteAccount')

  if (!organization || !user) {
    return <div>{t('organizationNotFound')}</div>
  }

  return (
    <main className="flex flex-col items-center justify-center">
      <OrganizationLayout
        orgId={params.id}
        userProps={{
          id: user.id,
          name: user.name,
          email: user.email,
          picture: user.picture ?? ''
        }}
      >
        <section className="w-full h-screen p-4 rounded-lg border text-card-foreground shadow-sm bg-primary">
          <div className="flex w-full justify-between">
            <h1 className="text-xl sm:text-2xl font-bold">
              {t('manageOrganizersFor') + ' '} {organization.name}
            </h1>
            <div>
              <AddOrganizerButton organizationId={params.id} />
            </div>
          </div>

          {/* Encabezado para la tabla */}
          <div className="flex flex-row justify-between bg-gray-700 p-4 rounded mt-4">
            <div className="col-span-6 text-sm font-semibold text-primary">
              {t('organizer')}
            </div>
            <div className="col-span-3 text-sm font-semibold text-primary"></div>
            <div className="col-span-3 text-sm font-semibold text-primary text-right">
              {t('rol')}
            </div>
          </div>

          <div className="overflow-y-auto dark:bg-primary rounded-lg">
            {organizers.map(organizer => (
              <div
                key={organizer.user.id}
                className="flex flex-row justify-between border-b border-gray-700"
              >
                <div className="flex flex-row items-center last:rounded-b-md p-4 transition-all">
                  {organizer.user.name}
                </div>
                <div className="flex flex-row items-center dark:bg-primary last:rounded-b-md p-4 transition-all">
                  {organizer.role}
                </div>
              </div>
            ))}
          </div>
        </section>
      </OrganizationLayout>
    </main>
  )
}
