import Link from 'next/link'
import { Calendar, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { PublicEventType } from '@/schemas/eventSchema'
import { useTranslations } from 'next-intl'
import { formatRangeDatesByTimezoneLabel } from '@/components/utils'

function createGoogleMapsUrl(location: string) {
  const searchQuery = encodeURIComponent(location)
  return `https://www.google.com/maps/search/?api=1&query=${searchQuery}`
}

export function EventDetails({ event }: { event: PublicEventType }) {
  const {
    featuredIn,
    title,
    subtitle,
    location,
    city,
    startDate,
    endDate,
    timezoneLabel
  } = event
  const t = useTranslations('EventDescription')
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {featuredIn &&
        featuredIn.map(featured => (
          <Badge
            key={featured.name}
            variant="secondary"
            className="text-xs px-2 py-1"
          >
            {t('eventFeaturedIn')}{' '}
            <Link
              href={featured.url}
              className="font-medium hover:underline ml-1"
            >
              {featured.name}
            </Link>
          </Badge>
        ))}
      <h1 className="text-3xl md:text-4xl font-bold leading-tight">{title}</h1>
      <div className="bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mt-8 ml-0 w-[100%]" />
      <p className="text-lg md:text-xl text-primary-foreground/80">
        {subtitle}
      </p>
      <div className="flex flex-col gap-4 text-sm">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary-foreground/60" />
            <time>
              {formatRangeDatesByTimezoneLabel(
                startDate,
                timezoneLabel,
                endDate
              )}
            </time>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {location && city && (
            <>
              <MapPin className="h-5 w-5 text-primary-foreground/60" />
              <address className="not-italic">
                <a
                  href={createGoogleMapsUrl(location)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-primary-foreground/90 transition-colors"
                >
                  {location}, {city}
                </a>
              </address>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
