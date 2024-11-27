import { getOrganization } from '@/services/actions/organizationActions'
import { getUser } from '@/lib/auth/lucia'
import OrganizationLayout from '@/components/orgs/OrganizationLayout'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'

import Link from 'next/link'
import { getOrganizationEvents } from '@/services/actions/event/getOrganizationEvents'
import { translations } from '@/lib/translations/translations'

export default async function EventsPage({
  params
}: {
  params: { id: string }
}) {
  const organization = await getOrganization(params.id)
  const user = await getUser()
  const events = await getOrganizationEvents(params.id)
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
            id: user.id,
            picture: user.picture!,
            email: user.email,
            name: user.name
          }}
        >
          <section>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">{translations.es.events}</h1>
              <Link
                href={`/admin/organizations/${params.id}/events/new`}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                {translations.es.createNewEvents}
              </Link>
            </div>

            <div>
              {events.map(event => (
                <Link
                  href={`/admin/organizations/${params.id}/events/${event.id}`}
                  key={event.id}
                  className="block p-4 border rounded-md cursor-pointer"
                >
                  {event.title} - {new Date(event.startDate).toLocaleString()}
                </Link>
              ))}
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
