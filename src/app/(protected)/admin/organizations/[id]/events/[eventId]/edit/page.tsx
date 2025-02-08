import { EventForm } from '@/components/events/EventForm'
import { getUser } from '@/lib/auth/lucia'
import { getEvent } from '@/services/actions/event/getEvent'
import { getOrganization } from '@/services/actions/organizationActions'
import { Roles } from '@prisma/client'
import { ArrowLeft } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

export default async function Page({
  params
}: {
  params: { eventId: string; id: string }
}) {
  const organization = await getOrganization(params.id)
  const user = await getUser()
  const t = await getTranslations('EventsPage')

  const event = await getEvent({
    eventId: params.eventId,
    includeTickets: true
  })

  if (!event) {
    notFound()
  }

  if (user) {
    if (user.role === Roles.ADMIN) {
      return (
        <div className="py-4 border p-2 sm:p-6 h-full mx-auto dark:bg-primary ">
          <div className="max-w-5xl mx-auto mb-4 dark:bg-primary rounded-lg shadow-lg">
            {/* Encabezado con flecha para retroceder */}
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center space-x-2">
                <Link
                  href={`/admin/organizations/${params.id}/events/${params.eventId}/summary`}
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-bold sm:text-xl">
                  {t('editEvent')}
                </h1>{' '}
                {/* Título responsivo */}
              </div>

              <Link
                href={`/admin/organizations/${params.id}/events`}
                className="px-4 py-2 rounded-lg font-bold transition-colors bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-neutral-600 dark:text-white dark:hover:bg-neutral-500"
              >
                {t('cancel')}
              </Link>
            </div>

            {organization && (
              <EventForm organizationId={organization.id} event={event} />
            )}
          </div>
        </div>
      )
    } else if (user.role === Roles.NEW_USER) {
      redirect(`/newuser`)
    } else if (user.role === Roles.USER) {
      redirect(`/user`)
    }
  }
}
