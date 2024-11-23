import { getEvent } from '@/services/actions/event/getEvent'
import { getUser } from '@/lib/auth/lucia'
import OrganizationLayout from '@/components/orgs/OrganizationLayout'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'
import Link from 'next/link'
import { EventAdminView } from '@/components/EventAdminView'
import { getEventRegistrations } from '@/services/actions/event/getEventAttendees'
import { translations } from '@/lib/translations/translations'

export default async function EventDetailsPage({
  params
}: {
  params: { id: string; eventId: string }
}) {
  const event = await getEvent(params.eventId)
  const user = await getUser()
  const attendees = await getEventRegistrations(params.eventId)

  if (!event) {
    return <div>{translations.es.eventNotFound}</div>
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
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">
              {translations.es.eventTitleInEventDetails} {event.title}
            </h1>
            <div className="flex space-x-2">
              <Link
                href={`/admin/organizations/${params.id}/events`}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-200 text-gray-800 hover:bg-gray-300 h-10 px-4 py-2"
              >
                {translations.es.backToEvents}
              </Link>
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-white hover:bg-red-700 h-10 px-4 py-2">
                {translations.es.deleteEvent}
              </button>
            </div>
          </div>

          <section className="border rounded-md p-4">
            <h2 className="text-xl font-bold mb-2">
              {translations.es.eventDetails}
            </h2>
            <div className="flex justify-between mb-2">
              <div>
                <span className="font-semibold">
                  {translations.es.startDate}
                </span>
                <p>{new Date(event.startDate).toLocaleString()}</p>
              </div>
              <div>
                <span className="font-semibold">{translations.es.endDate}</span>
                <p>{new Date(event.endDate).toLocaleString()}</p>
              </div>
            </div>
            <div>
              <span className="font-semibold">
                {translations.es.description}
              </span>
              <p>{event.description}</p>
            </div>
          </section>
          <EventAdminView registrations={attendees} eventId={params.eventId} />
        </OrganizationLayout>
      </main>
    )
  } else if (user.role === Roles.NEW_USER) {
    redirect('/newuser')
  } else if (user.role === Roles.USER) {
    redirect('/user')
  }
}
