import EventCard from '../mainLanding/EventCard'
import { PublicEventType } from '@/schemas/eventSchema'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

// EventHeader Component
const EventHeader = () => {
  const t = useTranslations('CommunityHighlights')
  return (
    <div className="relative mb-12 pb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            {t('eventsNear')}
          </h2>
        </div>
        {/* Uncomment and modify this block if you want to add a "See All Events" link */}
        {/* 
        <Link
          href="#"
          className="text-blue-400 hover:text-blue-300 transition-colors group flex items-center"
        >
          {t('seeAllEvents')}
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </Link> 
        */}
      </div>
      {/* <Link
        href="#"
        className="text-blue-400 hover:text-blue-300 transition-colors group flex items-center"
      >
        See all events
        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </Link> */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
    </div>
  )
}

type Props = {
  events: PublicEventType[]
  showHeader?: boolean
  isSearchable?: boolean
}

// Main UpcomingEvents Component
const PublicEventsList = ({ events, showHeader = true }: Props) => {
  const t = useTranslations('CommunityHighlights')
  return (
    <section id="events" className="w-full bg-black min-h-screen relative">
      <div className="relative w-full py-12">
        <div className="max-w-7xl mx-auto">
          {events.length > 5 && showHeader && <EventHeader />}
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {events.map(event => (
                <Link key={event.id} href={`/${event.id}`} prefetch={true}>
                  <EventCard key={event.id} event={event} />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center mt-6">
              <span>{t('noEventsFound')}</span>
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default PublicEventsList
