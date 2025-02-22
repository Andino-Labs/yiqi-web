import OrganizationLayout from '@/components/orgs/OrganizationLayout'
import { getAllOrganizationsForCurrentUser } from '@/services/actions/organizationActions'
import { OrganizationType } from '@/schemas/organizerSchema'
import { getTranslations } from 'next-intl/server'
import { getUserOrRedirect } from '@/lib/auth/getUserOrRedirect'

export default async function Layout({
  params,
  children
}: {
  params: { id: string }
  children: React.ReactNode
}) {
  const { user } = await getUserOrRedirect()

  const organizations: OrganizationType[] =
    await getAllOrganizationsForCurrentUser()
  const currentOrg = organizations.find(org => org.id === params.id)?.name
  const t = await getTranslations('contactFor')

  return (
    <main className="flex flex-col items-center justify-center dark:bg-[rgb(28, 28, 28)]">
      <OrganizationLayout
        currentOrgId={params.id}
        userProps={{
          picture: user.picture!,
          email: user.email,
          name: user.name,
          id: user.id
        }}
        organizations={organizations.map(org => ({
          name: org.name,
          id: org.id
        }))}
        currentOrg={currentOrg}
      >
        {currentOrg ? children : <div>{t('organizationNotFound')}</div>}
      </OrganizationLayout>
    </main>
  )
}
