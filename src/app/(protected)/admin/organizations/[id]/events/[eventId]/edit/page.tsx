import { EventForm } from '@/components/events/EventForm'
import { getEvent } from '@/services/actions/event/getEvent'
import { notFound } from 'next/navigation'

export default async function Page({
  params
}: {
  params: { eventId: string }
}) {
  const event = await getEvent(params.eventId)

  if (!event) {
    notFound()
  }

  return (
    <div>
      <EventForm organizationId={event.organizationId} event={event} />
    </div>
  )
}
