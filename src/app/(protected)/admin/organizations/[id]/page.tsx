import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'
import { getOrganization } from '@/services/actions/organizationActions'
import Link from 'next/link'
import OrganizationLayout from '@/components/orgs/organizationLayout'

export default async function Page({ params }: { params: { id: string } }) {
  const organization = await getOrganization(params.id)

  if (!organization) {
    return <div>Organization not found</div>
  }
  const user = await getUser()
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
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">
              {organization.name} Dashboard
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href={`/admin/organizations/${params.id}/organizers`}
                className="p-4 bg-blue-100 rounded"
              >
                Manage Organizers
              </Link>
              <Link
                href={`/admin/organizations/${params.id}/events`}
                className="p-4 bg-green-100 rounded"
              >
                Manage Events
              </Link>
              <Link
                href={`/admin/organizations/${params.id}/contacts`}
                className="p-4 bg-yellow-100 rounded"
              >
                Contact List
              </Link>
            </div>
          </div>
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
