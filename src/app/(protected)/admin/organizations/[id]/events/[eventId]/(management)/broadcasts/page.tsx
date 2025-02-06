import EventCommunicationsTable from '@/components/events/EventCommunicationsTable'
import { getTranslations } from 'next-intl/server'

import { NotifyMyAudience } from './_components/NotifyMyAudience'

export default async function Page({
  params
}: {
  params: { eventId: string }
}) {
  const t = await getTranslations('DeleteAccount')

  return (
    <div>
      <h2 className="text-xl font-bold text-secondary dark:text-gray-100">
        {t('sendNewCommunication')}
      </h2>
      <hr className="my-4 border-t border-solid border-white-opacity-40 w-[100%]  mx-auto ml-0" />

      <div className="space-y-4">
        <NotifyMyAudience eventId={params.eventId} />
        <EventCommunicationsTable eventId={params.eventId} />
      </div>
    </div>
  )
}
