import { getEvent } from '@/services/actions/event/getEvent'
import { getTranslations } from 'next-intl/server'
import { Calendar, MapPin } from 'lucide-react'
import { MdPreview } from '@/components/events/editor/MdPreview'
import { Card, CardContent } from '@/components/ui/card'
import { formatRangeDatesByTimezoneLabel } from '@/components/utils'

export default async function Page({
  params
}: {
  params: { eventId: string }
}) {
  const event = await getEvent({ eventId: params.eventId })
  const t = await getTranslations('DeleteAccount')

  return (
    <div>
      <h2 className="text-xl font-bold text-secondary dark:text-gray-100">
        {t('eventDetails')}
      </h2>
      <hr className="my-4 border-t border-solid border-white-opacity-40 w-[100%]  mx-auto ml-0" />
      <div className="flex flex-col gap-4 text-sm">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary-foreground/60" />
            <time>
              {formatRangeDatesByTimezoneLabel(
                event.startDate,
                event.timezoneLabel
              )}
            </time>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {event.location && event.city && (
            <>
              <MapPin className="h-5 w-5 text-primary-foreground/60" />
              <address className="not-italic">
                {event.location}, {event.city}
              </address>
            </>
          )}
        </div>
      </div>
      <div>
        <div className="prose max-w-none dark:prose-invert">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6">
              {t('description')}
            </h2>
            <hr className="my-4 border-t border-solid border-white-opacity-40 w-[100%]  mx-auto ml-0" />
            <Card className="bg-black backdrop-blur-sm text-white w-[100%] sm:max-w-[400px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] border-0">
              <CardContent className="p-4 md:p-6">
                <div className="prose prose-sm max-w-none overflow-x-auto">
                  <MdPreview
                    content={event.description || ''}
                    darkMode={true}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
