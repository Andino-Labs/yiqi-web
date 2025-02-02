import EventRegistrationTable from '@/components/events/EventRegistrationTable'
import { ExportUserDataButton } from '@/components/events/ExportUserDataButton'
import { getEventRegistrations } from '@/services/actions/event/getEventAttendees'
import { getEventCustomFields } from '@/services/actions/event/getEventCustomFields'
import { getTranslations } from 'next-intl/server'

export default async function Page({
  params
}: {
  params: { eventId: string }
}) {
  const t = await getTranslations('DeleteAccount')

  const [attendees, eventData] = await Promise.all([
    getEventRegistrations(params.eventId),
    getEventCustomFields(params.eventId)
  ])

  return (
    <div>
      <h2 className="text-xl font-bold text-secondary dark:text-gray-100">
        {t('eventRegistrations')}
      </h2>
      <hr className="my-4 border-t border-solid border-white-opacity-40 w-[100%]  mx-auto ml-0" />
      <ExportUserDataButton data={eventData} />
      <EventRegistrationTable registrations={attendees} />
    </div>
  )
}
