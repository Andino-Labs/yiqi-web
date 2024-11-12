import { getEventRegistrations } from '@/services/actions/eventActions'
import EventCheckinTable from '@/components/events/EventCheckinTable'
import { getEventData } from '@/lib/event/getEventData'

export default async function CheckinPage({
  params
}: {
  params: { id: string; eventId: string }
}) {
  const { organization, event, isAdmin, notFound } = await getEventData(
    params.id,
    params.eventId
  )

  if (notFound) {
    return <div>Event not found</div>
  }

  if (!isAdmin) {
    return <div>Unauthorized</div>
  }

  if (!organization || !event) {
    return <div>Organization or Event not found</div>
  }
  const registrations = await getEventRegistrations(params.eventId)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Event registrations: {event.title}
      </h1>
      <div className="overflow-x-auto">
        <EventCheckinTable eventId={event.id} registrations={registrations} />
      </div>
    </div>
  )
}
