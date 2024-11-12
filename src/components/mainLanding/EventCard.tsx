import { EventListItem } from '@/data/events'
import { Calendar, MapPin, Users } from 'lucide-react'
import Image from 'next/image'
import { format } from 'date-fns'

const EventCard = ({ event }: { event: EventListItem }) => (
  <div className="group relative bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10" />
    <div className="absolute inset-[1px] bg-gray-900 rounded-xl -z-5" />

    <div className="relative h-48 w-full">
      <Image
        src={event.image}
        alt={event.title}
        fill
        className="object-cover"
      />
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
            {format(new Date(event.startDate), 'EEE, MMM d · h:mm a')}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-300">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{event.location}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <Image
                src={event.organization.logo}
                alt={event.organization.name}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <span className="text-sm text-gray-300">
              {event.organization.name}
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
)

export default EventCard
