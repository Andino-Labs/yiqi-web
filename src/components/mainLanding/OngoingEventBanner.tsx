'use client'

import { motion } from 'framer-motion'
import { MapPin, Calendar, Dot } from 'lucide-react'
import Image from 'next/image'
import { type SavedEventType } from '@/schemas/eventSchema'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TooltipProvider } from '@/components/ui/tooltip'
import { formatRangeDatesByTimezoneLabel } from '../utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

interface OngoingEventBannerProps {
  event: SavedEventType
}

export function OngoingEventBanner({
  event
}: OngoingEventBannerProps): JSX.Element {
  const t = useTranslations('ongoingEventBanner')
  const { title, openGraphImage, startDate, location, timezoneLabel, id } =
    event

  const isEventOnGoing = (startDate: Date) =>
    new Date().getTime() >= startDate.getTime()

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl mx-auto px-4 mb-6 sm:mb-8"
      >
        <Card className="overflow-hidden bg-gradient-to-br from-black via-[#0a1a1c] to-[#093438] border-[#6de4e8]/30 hover:border-[#6de4e8]/50 transition-all duration-300 group">
          <CardContent className="p-4 lg:p-6">
            <div className="space-y-4 lg:flex lg:space-y-0 lg:space-x-4">
              {/* Image Section */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="w-full lg:w-[350px] h-[250px] aspect-video relative rounded-xl overflow-hidden flex-shrink-0 shadow-lg"
              >
                <Image
                  src={openGraphImage || '/placeholder-event.jpg'}
                  alt={title || 'evento en curso'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  priority
                />
                <Badge className="absolute top-3 left-3 right-3 bg-black/80 backdrop-blur-sm text-[#6de4e8] font-medium px-3 py-1.5 rounded-lg">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatRangeDatesByTimezoneLabel(startDate, timezoneLabel)}
                </Badge>
              </motion.div>

              {/* Content Section */}
              <div className="space-y-2 lg:flex-grow">
                {/* Event Status */}
                <div className="text-right">
                  <Badge className="bg-[#6de4e8]/20 text-[#6de4e8] hover:bg-[#6de4e8]/30 px-3 py-1 rounded-md">
                    <Dot className="w-6 h-6 -ml-1.5 text-[#6de4e8] animate-pulse" />
                    {isEventOnGoing(startDate)
                      ? t('ongoingEvent')
                      : t('nextToStart')}
                  </Badge>
                </div>

                {/* Event Title */}
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight line-clamp-2">
                  {title}
                </h3>

                {/* Location */}
                {location && (
                  <div className="flex items-center text-[#6de4e8]/80">
                    <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span className="text-lg">{location}</span>
                  </div>
                )}

                <div className="space-y-3 xl:space-y-0 xl:flex xl:items-center xl:gap-x-4">
                  <Link href={`/${id}`} className="block">
                    <Button
                      size="lg"
                      className="font-bold bg-gradient-to-r from-[#04F1FF] to-[#6de4e8] text-black hover:opacity-90 transition-opacity w-[40%] sm:w-auto"
                    >
                      <span className="text-[12px] md:text-base text-gray-800">
                        {t('joinEvent')}
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  )
}
