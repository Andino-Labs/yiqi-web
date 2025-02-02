'use client'

import { EventTypeEnum, SavedEventType } from '@/schemas/eventSchema'
import { motion } from 'framer-motion'
import { Dot, Link, Ticket } from 'lucide-react'
import { format } from 'date-fns'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from '@/hooks/use-toast'

const formatDate = (dateString: Date) => {
  return format(new Date(dateString), 'dd MMM | HH:mm')
}

const OngoingEventBanner = ({ event }: { event: SavedEventType }) => {
  const { title, openGraphImage, startDate, location, virtualLink, type } =
    event
  const isOnlineEvent = type === EventTypeEnum.ONLINE
  const router = useRouter()
  const t = useTranslations('ongoingEventBanner')
  const onButtonClick = useCallback(() => {
    if (isOnlineEvent) {
      if (virtualLink) {
        window.open(virtualLink, '_blank')
      } else {
        toast({
          title: 'Error',
          description: t('linkUnvailable'),
          variant: 'destructive'
        })
      }
    } else {
      router.push('/user/tickets')
    }
  }, [isOnlineEvent, virtualLink, router, t])

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="max-w-7xl mx-auto mb-6 sm:mb-0 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-black to-[#6de4e8]/10 border border-[#6de4e8]/20 flex flex-col md:flex-row gap-6 sm:gap-8 items-start sm:items-center justify-start sm:justify-between"
    >
      {/* Event Image */}
      <div className="w-full sm:w-[250px] h-[150px] relative rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={openGraphImage || '/placeholder-event.jpg'}
          alt={title || 'ongoing-event'}
          fill
          className="rounded-lg object-cover shadow-lg"
        />
        <div className="absolute top-2 left-2 bg-black/80 text-white text-base font-medium px-2 py-1 rounded-md">
          {formatDate(startDate)}
        </div>
      </div>

      {/* Event Details */}
      <div className="flex-1 gap-2 justify-start flex-wrap">
        <span className="text text-green-500 flex items-center">
          <Dot /> {t('ongoingEvent')}
        </span>
        <h3 className="my-1 text-xl sm:text-2xl font-bold text-white">
          {title}
        </h3>
        {location && (
          <p className="text-gray-400 text-sm sm:text-base">{location}</p>
        )}
      </div>

      {/* Action Section */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onButtonClick}
        className="flex self-center items-center bg-gradient-to-r from-[#04F1FF] to-[#6de4e8] text-black font-medium text-sm sm:text-base p-3 rounded-lg shadow-md mt-3 sm:mt-4"
      >
        {isOnlineEvent ? (
          <>
            <Link className="text-xl mr-1" /> {t('joinEvent')}
          </>
        ) : (
          <>
            <Ticket className="text-xl mr-1" /> {t('viewTicket')}
          </>
        )}
      </motion.button>
    </motion.div>
  )
}

export default OngoingEventBanner
