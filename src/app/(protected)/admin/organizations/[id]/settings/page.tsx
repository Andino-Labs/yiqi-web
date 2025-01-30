import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'
import { getOrganization } from '@/services/actions/organizationActions'
import OrganizationSettings from '@/components/settings/organizationSettings/organizationSettings'

export default async function Settings({ params }: { params: { id: string } }) {
  const user = await getUser()
  const organization = await getOrganization(params.id)

  if (user) {
    if (user.role === Roles.ADMIN) {
      return (
        <>
          {organization && (
            <OrganizationSettings
              userId={user.id}
              organization={organization}
            />
          )}
        </>
      )
    } else if (user.role === Roles.NEW_USER) {
      redirect('/newuser')
    } else if (user.role == Roles.ANDINO_ADMIN) {
      redirect('/andino-admin')
    } else if (user.role === Roles.USER) {
      redirect('/user')
    }
  }
}
