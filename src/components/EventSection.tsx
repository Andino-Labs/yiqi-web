'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Eye, Trash } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { EventCommunityType } from '@/schemas/eventSchema'

export default function EventSection({
  events,
  orgId
}: {
  events: EventCommunityType[]
  orgId: string
}) {
  const t = useTranslations('contactFor')
  const [currentPage, setCurrentPage] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const EVENTS_PER_PAGE = isMobile ? 10 : 8

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 450)
    }
    checkMobile()

    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE)

  const paginatedEvents = events.slice(
    (currentPage - 1) * EVENTS_PER_PAGE,
    currentPage * EVENTS_PER_PAGE
  )

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <>
      <section className="w-full sm:p-4 rounded-lg sm:border text-card-foreground shadow-sm h-full h-fit bg-primary">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t('events')}</h1>
          <div className="flex flex-col sm:flex-row sm:justify-end items-center sm:items-end sm:mt-0">
            <Link
              href={`/admin/organizations/${orgId}/events/new`}
              className="font-bold dark:text-primary hover:opacity-90 transition-opacity rounded-md text-center w-full sm:w-auto px-4 py-2 dark:bg-neutral-600"
              style={{
                paddingLeft: '1.2rem',
                paddingRight: '1.2rem',
                whiteSpace: 'normal'
              }}
            >
              {t('createNewEvents')}
            </Link>
          </div>
        </div>

        {/* Encabezado para la tabla */}
        <div className="hidden sm:grid grid-cols-12 bg-gray-700 p-4 rounded">
          <div className="col-span-6 text-sm font-semibold text-primary">
            {t('event')}
          </div>
          <div className="col-span-3 text-sm font-semibold text-primary"></div>
          <div className="col-span-3 text-sm font-semibold text-primary text-right">
            {t('action')}
          </div>
        </div>
        {/* Lista de eventos */}
        <div className="events-list overflow-y-auto rounded-lg cursor-pointer">
          {paginatedEvents.map(event => (
            <div
              key={event.id}
              className="relative flex flex-row items-center dark:bg-primary p-2 border-b border-gray-700 last:rounded-b-md hover:bg-gray-700 transition-all"
            >
              <div className="flex flex-row w-full">
                {/* Contenedor para el texto */}
                <div
                  className={`flex-1 flex flex-col ${
                    isMobile ? 'w-[70%]' : 'w-full'
                  }`}
                >
                  <div className="text-lg font-semibold dark:text-primary truncate overflow-hidden whitespace-nowrap">
                    {event.title}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {new Date(event.startDate).toLocaleString()}
                  </div>
                </div>

                {/* Contenedor para los iconos */}
                <div
                  className={`flex justify-end space-x-3 mt-2 sm:mt-0 ${
                    isMobile ? 'w-[30%]' : 'w-auto'
                  }`}
                >
                  <Link
                    href={`/admin/organizations/${orgId}/events/${event.id}`}
                    className="text-gray-300 hover:text-primary mt-4"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                  <button className="text-red-600 hover:text-red-50 mt-2 sm:mt-0">
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Controles de paginación */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1 ? 'cursor-not-allowed' : ''
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-sm">
          {t('page')} {currentPage} {t('of')} {totalPages}
        </span>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages ? 'cursor-not-allowed' : ''
          }`}
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </>
  )
}
