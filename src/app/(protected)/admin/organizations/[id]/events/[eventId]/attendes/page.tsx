import EventRegistrationTable from '@/components/events/EventRegistrationTable'
import { getEventRegistrations } from '@/services/actions/event/getEventAttendees'
import { getTranslations } from 'next-intl/server'

export default async function Page({
  params
}: {
  params: { eventId: string }
}) {
  const t = await getTranslations('DeleteAccount')
  const attendees = await getEventRegistrations(params.eventId)

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">{t('eventRegistrations')}</h2>
      <EventRegistrationTable registrations={attendees} />
    </div>
  )
}
