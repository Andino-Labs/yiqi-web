import { getOrganization } from '@/services/actions/organizationActions'
import { getUser } from '@/lib/auth/lucia'
import OrganizationLayout from '@/components/orgs/organizationLayout'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'
import { Link } from 'lucide-react'

export default async function EventsPage({
  params
}: {
  params: { id: string }
}) {
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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Events</h1>
              <Link
                href={`/admin/organizations/${params.id}/events/new`}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Create New Event
              </Link>
            </div>
          </section>
        </OrganizationLayout>
      </main>
    )
  } else if (user.role === Roles.NEW_USER) {
    redirect('/newuser')
  } else if (user.role === Roles.USER) {
    redirect('/user')
  }
}
