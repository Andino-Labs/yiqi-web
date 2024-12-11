import { getEvent } from '@/services/actions/event/getEvent'
import { getUser } from '@/lib/auth/lucia'
import OrganizationLayout from '@/components/orgs/OrganizationLayout'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'
import { EventAdminView } from '@/components/EventAdminView'
import { getEventRegistrations } from '@/services/actions/event/getEventAttendees'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { ArrowLeft, Calendar, Link2, MapPin, Pencil, Trash } from 'lucide-react'
import { MdPreview } from '@/components/events/editor/MdPreview'
import { Card, CardContent } from '@/components/ui/card'

export default async function EventDetailsPage({
  params
}: {
  params: { id: string; eventId: string }
}) {
  const event = await getEvent({ eventId: params.eventId })
  const user = await getUser()
  const attendees = await getEventRegistrations(params.eventId)

  const t = await getTranslations('DeleteAccount')

  if (!event) {
    return (
      <div className="text-center text-gray-700 dark:text-gray-300">
        {t('eventNotFound')}
      </div>
    )
  }

  if (!user) {
    redirect(`/auth`)
  }

  if (user.role === Roles.ADMIN) {
    return (
      <main className="flex flex-col items-center justify-center bg-gray-50 dark:bg-primary min-h-screen ">
        <OrganizationLayout
          orgId={params.id}
          userProps={{
            id: user.id,
            picture: user.picture!,
            email: user.email,
            name: user.name
          }}
        >
          {/* Header */}
          <div className="w-full sm:border text-card-foreground shadow-sm h-screen h-fit mx-auto dark:bg-primary sm:py-4 sm:px-2 rounded">
            <div className="w-full flex flex-row sm:flex-row justify-between items-center">
              {/* Back Button and Title */}
              <div className="flex items-center space-x">
                <Link
                  href={`/admin/organizations/${params.id}/events`}
                  className="flex items-center justify-center dark:bg-primary dark:text-primary dark:text-gray-100 hover:bg-gray-300 rounded-md p-2"
                  aria-label={t('backToEvents')}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center sm:text-left">
                  {event.title}
                </h1>
              </div>
              {/* Action Buttons */}
              <div className="flex space-x sm:mt-0">
                <Link
                  href={`/admin/organizations/${params.id}/events/${params.eventId}/edit`}
                  className="flex items-center justify-center dark:bg-primary dark:text-primary rounded-md p-2"
                  aria-label={t('editEvent')}
                >
                  <Pencil className="w-5 h-5" />
                </Link>
                <Link
                  href={`/${params.eventId}`}
                  className="flex items-center justify-center dark:bg-primary dark:text-primary rounded-md p-2"
                  aria-label={t('viewEvent')}
                >
                  <Link2 className="w-5 h-5" />
                </Link>
                <button
                  className="flex items-center justify-center dark:bg-primary dark:text-primary rounded-md p-2"
                  aria-label={t('deleteEvent')}
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Event Details Section */}
            <section className="w-full bg-primary sm:px-4 py-3 sm:px-6 py-6">
              <h2 className="text-xl font-bold text-secondary dark:text-gray-100">
                {t('eventDetails')}
              </h2>
              <hr className="my-4 border-t border-solid border-white-opacity-40 w-[100%]  mx-auto ml-0" />
              <div className="flex flex-col gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary-foreground/60" />
                  <time>{new Date(event.startDate).toLocaleString()}</time>
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
            </section>

            {/* Attendees Section */}
            <div>
              <EventAdminView
                registrations={attendees}
                eventId={params.eventId}
              />
            </div>
          </div>
        </OrganizationLayout>
      </main>
    )
  } else if (user.role === Roles.NEW_USER) {
    redirect(`/newuser`)
  } else if (user.role === Roles.USER) {
    redirect(`/user`)
  }
}
