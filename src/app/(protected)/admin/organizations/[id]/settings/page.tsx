import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'
import OrganizationLayout from '@/components/orgs/OrganizationLayout'
import { getOrganization } from '@/services/actions/organizationActions'
import OrganizationSettings from '@/components/settings/organizationSettings/organizationSettings'

export default async function Settings({ params }: { params: { id: string } }) {
  const user = await getUser()
  const organization = await getOrganization(params.id)
  if (!user) {
    redirect('/auth')
  }
  if (user.role === Roles.ADMIN) {
    return (
      <main className="flex flex-col items-center justify-center dark:bg-[rgb(28, 28, 28)]">
        <OrganizationLayout
          orgId={params.id}
          userProps={{
            picture: user.picture!,
            email: user.email,
            name: user.name,
            id: user.id
          }}
        >
          {organization && (
            <OrganizationSettings
              userId={user.id}
              organization={organization}
            />
          )}
        </OrganizationLayout>
      </main>
    )
  } else if (user.role === Roles.NEW_USER) {
    redirect('/newuser')
  } else if (user.role == Roles.ANDINO_ADMIN) {
    redirect('/andino-admin')
  } else if (user.role === Roles.USER) {
    redirect('/user')
  }
}
