import { getTranslations } from 'next-intl/server'
import { TabHeader } from './_components/TabHeader'
import Link from 'next/link'
import { ArrowLeft, Link2, Pencil, Trash } from 'lucide-react'
import { getEvent } from '@/services/actions/event/getEvent'
import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'

export default async function Layout({
  params,
  children
}: {
  params: { id: string; eventId: string }
  children: React.ReactNode
}) {
  const event = await getEvent({ eventId: params.eventId })

  const t = await getTranslations('ManagementEventTabs')
  const tabOptions = [
    { href: 'summary', label: t('summary') },
    { href: 'attendes', label: t('attendes') },
    { href: 'registration', label: t('registration') },
    { href: 'broadcasts', label: t('broadcasts') }
  ]
  const user = await getUser()

  if (user) {
    if (user.role === Roles.ADMIN) {
      return (
        <div>
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
          <TabHeader options={tabOptions} />
          {children}
        </div>
      )
    } else if (user.role === Roles.NEW_USER) {
      redirect(`/newuser`)
    } else if (user.role === Roles.USER) {
      redirect(`/user`)
    }
  }
}
