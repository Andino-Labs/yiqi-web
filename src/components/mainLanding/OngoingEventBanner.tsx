'use client'

import { motion } from 'framer-motion'
import {
  LinkIcon,
  Ticket,
  UserPlus,
  Settings,
  MapPin,
  Calendar,
  Dot
} from 'lucide-react'
import { format } from 'date-fns'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import { EventTypeEnum, type SavedEventType } from '@/schemas/eventSchema'
import {
  userDataCollectedShema,
  type LuciaUserType
} from '@/schemas/userSchema'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

interface OngoingEventBannerProps {
  event: SavedEventType
  user?: LuciaUserType
}

function formatDate(dateString: Date): string {
  return format(new Date(dateString), 'dd MMM | HH:mm')
}

export function RenderMatchmakingInfo({
  user
}: {
  user?: LuciaUserType
}): JSX.Element | null {
  const router = useRouter()
  if (!user) return null

  const validData = user.dataCollected ?? {}
  const userData = userDataCollectedShema.parse(validData)

  const isProfileComplete =
    userData.resumeUrl && userData.resumeText && user.userEmbeddableProfile

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
      className="mt-4 p-4 bg-[#6de4e8]/20 rounded-lg backdrop-blur-sm border border-[#6de4e8]/30"
    >
      <p className="text-sm text-[#6de4e8] mb-2 font-medium">
        {isProfileComplete
          ? 'Eres parte del Matchmaking impulsado por IA'
          : 'Completa tu perfil para el Matchmaking impulsado por IA'}
      </p>
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          router.push(
            isProfileComplete
              ? '/user/networking-matches'
              : '/user/networking-settings'
          )
        }
        className="w-full sm:w-auto bg-[#6de4e8]/10 hover:bg-[#6de4e8]/20 text-[#6de4e8]"
      >
        {isProfileComplete ? (
          <>
            <UserPlus className="mr-2 h-4 w-4" /> Ver coincidencias
          </>
        ) : (
          <>
            <Settings className="mr-2 h-4 w-4" /> Completar perfil
          </>
        )}
      </Button>
    </motion.div>
  )
}

export function OngoingEventBanner({
  event,
  user
}: OngoingEventBannerProps): JSX.Element {
  const { id, title, openGraphImage, startDate, location, virtualLink, type } =
    event
  const isOnlineEvent = type === EventTypeEnum.ONLINE
  const router = useRouter()

  function handleButtonClick(): void {
    if (!user) {
      router.push(`/${id}`)
      return
    }

    if (isOnlineEvent) {
      if (virtualLink) {
        window.open(virtualLink, '_blank')
      } else {
        toast({
          title: 'Error',
          description: 'El enlace no está disponible',
          variant: 'destructive'
        })
      }
    } else {
      router.push('/user/tickets')
    }
  }

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8"
      >
        <Card className="overflow-hidden bg-gradient-to-br from-black via-[#0a1a1c] to-[#093438] border-[#6de4e8]/30 hover:border-[#6de4e8]/50 transition-all duration-300 group">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
              {/* Image Section */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="w-full md:w-[300px] lg:w-[350px] aspect-video relative rounded-xl overflow-hidden flex-shrink-0 shadow-lg"
              >
                <Image
                  src={openGraphImage || '/placeholder-event.jpg'}
                  alt={title || 'evento en curso'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  priority
                />
                <Badge className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-[#6de4e8] font-medium px-3 py-1.5 rounded-lg">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(startDate)}
                </Badge>
              </motion.div>

              {/* Content Section */}
              <div className="flex-1 min-w-0 space-y-4">
                {/* Event Status */}
                <Badge className="bg-[#6de4e8]/20 text-[#6de4e8] hover:bg-[#6de4e8]/30 px-3 py-1 rounded-md">
                  <Dot className="w-6 h-6 -ml-1.5 text-[#6de4e8] animate-pulse" />
                  Evento en curso
                </Badge>

                {/* Event Title */}
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight line-clamp-2">
                  {title}
                </h3>

                {/* Location */}
                {location && (
                  <Tooltip>
                    <TooltipTrigger className="text-left">
                      <div className="flex items-center text-[#6de4e8]/80">
                        <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
                        <span className="truncate text-lg">{location}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#0a1a1c] border-[#6de4e8]/30 text-[#6de4e8]">
                      <p>{location}</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Matchmaking Info */}
                <RenderMatchmakingInfo user={user} />

                {/* Action Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleButtonClick}
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-[#04F1FF] to-[#6de4e8] text-black font-bold hover:from-[#6de4e8] hover:to-[#04F1FF] transition-all shadow-lg hover:shadow-xl hover:shadow-[#6de4e8]/30"
                  >
                    {!user ? (
                      <>
                        <UserPlus className="mr-2 h-5 w-5" />
                        Registrarse al evento
                      </>
                    ) : isOnlineEvent ? (
                      <>
                        <LinkIcon className="mr-2 h-5 w-5" />
                        Unirse al evento
                      </>
                    ) : (
                      <>
                        <Ticket className="mr-2 h-5 w-5" />
                        Ver ticket
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  )
}
