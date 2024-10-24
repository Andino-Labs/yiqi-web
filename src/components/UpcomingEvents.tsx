import { eventListItem } from '@/data/events'
import { format } from 'date-fns'
import Image from 'next/image'
import { MapPin, Calendar, Users, ChevronRight, Edit2 } from 'lucide-react'
import Link from 'next/link'

const UpcomingEvents = () => {
  return (
    <section className="w-full bg-black min-h-screen relative">
      {/* Gradient Background */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none" /> */}

      <div className="relative w-full py-16 ">
        <div className="max-w-7xl mx-auto">
          {/* Header with Gradient Border */}
          <div className="relative mb-12 pb-4 border-b border-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Events near
                </h2>
                <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                  <span>San Francisco, CA</span>
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <Link
                href="#"
                className="text-blue-400 hover:text-blue-300 transition-colors group flex items-center"
              >
                See all events
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            {/* Gradient line under header */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          </div>

          {/* Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {eventListItem.map(event => (
              <div
                key={event.id}
                className="group relative bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300"
              >
                {/* Gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10" />
                <div className="absolute inset-[1px] bg-gray-900 rounded-xl -z-5" />

                <div className="relative h-48 w-full">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  {/* Gradient overlay on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
                </div>

                <div className="p-6 relative">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                      {event.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {format(new Date(event.time), 'EEE, MMM d · h:mm a')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{event.place}</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8">
                          <Image
                            src={event.organizer.avatar}
                            alt={event.organizer.name}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                        <span className="text-sm text-gray-300">
                          {event.organizer.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">54 going</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default UpcomingEvents
