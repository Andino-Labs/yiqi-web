import { getOrganization } from '@/services/actions/organizationActions'
import { getUser } from '@/lib/auth/lucia'
import OrganizationLayout from '@/components/orgs/organizationLayout'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'
import { CreateEventButton } from '@/components/events/createEvent'

export default async function Page({ params }: { params: { id: string } }) {
  const organization = await getOrganization(params.id)
  const user = await getUser()

  if (!organization) {
    return <div>Organization not found</div>
  }
  if (!user) {
    redirect('/auth')
  }
  if (user.role === Roles.ADMIN) {
    return (
      <main className="flex flex-col items-center justify-center">
        <OrganizationLayout
          orgId={params.id}
          userProps={{
            picture: user.picture!,
            email: user.email,
            name: user.name
          }}
        >
          <section>
            <CreateEventButton />
          </section>
        </OrganizationLayout>
      </main>
    )
  } else if (user.role === Roles.NEW_USER) {
    redirect('/newuser')
  } else if (user.role === Roles.USER) {
    redirect('/user')
  } else if (user.role === Roles.ANDINO_ADMIN) {
    redirect('/andino-admin')
  }
}
