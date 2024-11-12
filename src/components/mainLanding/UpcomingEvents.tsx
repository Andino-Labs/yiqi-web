// import Link from 'next/link'
// import { ChevronRight, Edit2 } from 'lucide-react'
import { EventListItem } from '@/data/events'
import EventCard from './EventCard'

// EventHeader Component
const EventHeader = () => (
  <div className="relative mb-12 pb-4">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-2">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Events near
        </h2>
      </div>
      {/* <Link
        href="#"
        className="text-blue-400 hover:text-blue-300 transition-colors group flex items-center"
      >
        See all events
        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </Link> */}
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
  </div>
)

// Main UpcomingEvents Component
const UpcomingEvents = ({ events }: { events: EventListItem[] }) => {
  return (
    <section id="events" className="w-full bg-black min-h-screen relative">
      <div className="relative w-full py-16">
        <div className="max-w-7xl mx-auto">
          <EventHeader />
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default UpcomingEvents
