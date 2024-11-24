import { EventCommunityType } from '@/schemas/eventSchema'
import Image from 'next/image'

interface EventCardProps {
  events: EventCommunityType[]
}

const EventCardCommunity = ({ events }: EventCardProps) => {
  return (
    <>
      <div className="flex flex-col gap-5">
        {events.map(event => (
          <div
            className="rounded-lg p-4 sm:p-6 w-full max-w-[90%] sm:max-w-[500px] mx-auto bg-gradient-to-r from-[#1E1B4B] to-[#3F1D38] shadow-lg shadow-[#FF0080]/20 relative overflow-hidden"
            key={event.id}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#1E1B4B] to-[#3F1D38] opacity-50"></div>
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                <div className="flex-1">
                  <h3 className="text-cyan-600 font-semibold text-sm sm:text-base">
                    {event.startDate.toDateString()}
                  </h3>
                  <h3 className="text-white font-semibold mt-1 text-md sm:text-xl">
                    {event.title}
                  </h3>
                </div>
                <div className="w-full sm:w-[180px] h-[120px] sm:h-[101px] relative rounded-xl overflow-hidden flex-shrink-0">
                  {event.openGraphImage ? (
                    <Image
                      src={event.openGraphImage}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-700 flex items-center justify-center">
                      <span className="text-white text-sm">
                        No hay imagen disponible
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default EventCardCommunity
