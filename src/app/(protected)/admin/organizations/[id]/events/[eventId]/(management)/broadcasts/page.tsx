import EventCommunicationsTable from '@/components/events/EventCommunicationsTable'
import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

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

      <div className="flex flex-col space-y-4">
        <Button className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md transition-all">
          <Send className="w-4 h-4 mr-2" />
          {t('sendNewCommunication')}
        </Button>
        <EventCommunicationsTable eventId={params.eventId} />
      </div>
    </div>
  )
}
