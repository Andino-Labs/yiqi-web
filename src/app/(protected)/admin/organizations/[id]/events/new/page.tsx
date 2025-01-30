import { EventForm } from '@/components/events/EventForm'
import { getUser } from '@/lib/auth/lucia'
import { Roles } from '@prisma/client'
import { ArrowLeft } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Page({ params }: { params: { id: string } }) {
  const user = await getUser()

  const t = await getTranslations('EventsPage')

  if (user) {
    if (user.role === Roles.ADMIN) {
      return (
        <div className="border p-2 sm:p-6 h-full h-fit mx-auto dark:bg-primary">
          {/* Contenedor principal */}
          <div className="max-w-5xl mx-auto mb-4 dark:bg-primary rounded-lg shadow-lg">
            {/* Encabezado con flecha para retroceder */}
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center space-x-2">
                <Link
                  href={`/admin/organizations/${params.id}/events`}
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" /> {/* Flecha izquierda */}
                </Link>
                <h1 className="text-2xl font-bold sm:text-xl">
                  {t('createNewEvent')}
                </h1>{' '}
                {/* Título responsivo */}
              </div>

              {/* Botón de cancelar */}
              <Link
                href={`/admin/organizations/${params.id}/events`}
                className="px-4 py-2 rounded-lg font-bold transition-colors bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-neutral-600 dark:text-white dark:hover:bg-neutral-500"
              >
                {t('cancel')}
              </Link>
            </div>

            {/* Formulario del evento */}
            <EventForm organizationId={params.id} />
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
