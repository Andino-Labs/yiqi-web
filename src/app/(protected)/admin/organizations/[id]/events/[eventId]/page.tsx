import { getOrganization } from '@/services/actions/organizationActions'
import Link from 'next/link'
import { getEventRegistrations } from '@/services/actions/event/getEventAttendees'
import { getEvent } from '@/services/actions/event/getEvent'
import { Edit } from 'lucide-react'
import { EventAdminView } from '@/components/EventAdminView'

export default async function EventDetailsPage({
  params
}: {
  params: { id: string; eventId: string }
}) {
  const organization = await getOrganization(params.id)

  const event = await getEvent(params.eventId)
  const attendees = await getEventRegistrations(params.eventId)

  if (!organization || !event) {
    return <div>Event or Organization not found</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Event: {event.title}</h1>
      <Link
        href={`/admin/organizations/${params.id}/events/${params.eventId}/edit`}
      >
        <Edit className="w-4 h-4 mr-2" /> Edit Event Details
      </Link>
      <p>Start: {new Date(event.startDate).toLocaleString()}</p>
      <p>End: {new Date(event.endDate).toLocaleString()}</p>
      <p>Description: {event.description}</p>
      <h2 className="text-xl font-bold mt-4 mb-2">Attendees:</h2>
      <Link
        href={`/admin/organizations/${params.id}/events`}
        className="mt-4 inline-block text-blue-500 hover:underline"
      >
        Back to Events
      </Link>
      <EventAdminView registrations={attendees} eventId={params.eventId} />
    </div>
  )
}
