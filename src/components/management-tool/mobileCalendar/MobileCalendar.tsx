'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  format,
  addDays,
  startOfToday,
  subDays,
  isSameDay,
  isBefore
} from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { PostTwitterSchema } from '@/schemas/twitterSchema'
import { useTranslations } from 'next-intl'

interface MobileCalendarViewProps {
  onOpenModal: (date: Date) => void
  posts: PostTwitterSchema[]
  onEditPost: (post: PostTwitterSchema) => void
}

export function MobileCalendarView({
  onOpenModal,
  posts,
  onEditPost
}: MobileCalendarViewProps) {
  const today = startOfToday()
  const [startDate, setStartDate] = useState(today)
  const days = Array.from({ length: 5 }, (_, i) => addDays(startDate, i))
  const t = useTranslations('ManagementTool')

  const goToPreviousDays = () => {
    setStartDate(prevDate => subDays(prevDate, 5))
  }

  const goToNextDays = () => {
    setStartDate(prevDate => addDays(prevDate, 5))
  }

  const goToToday = () => {
    setStartDate(today)
  }

  const isDateSelectable = (date: Date) => {
    return date >= today
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between sticky top-0 bg-background pt-4 pb-2">
        <Button variant="outline" size="sm" onClick={goToToday}>
          {t('today')}
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousDays}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToNextDays}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {days.map(day => {
        const isSelectable = isDateSelectable(day)
        const dayPosts = posts.filter(post =>
          isSameDay(new Date(post.scheduledDate), day)
        )
        const sortedPosts = dayPosts.sort(
          (a, b) =>
            new Date(a.scheduledDate).getTime() -
            new Date(b.scheduledDate).getTime()
        )
        const isPastDay = isBefore(day, today)

        return (
          <div key={day.toISOString()} className="space-y-2">
            <h3 className="text-lg font-semibold sticky top-16 bg-background py-2">
              {format(day, `d '${t('of')}' MMMM`, { locale: es })}
            </h3>
            <div className="space-y-2">
              {sortedPosts.length > 0 ? (
                sortedPosts.map(post => (
                  <Card
                    key={post.id}
                    className={`flex items-center justify-between p-4 cursor-pointer ${
                      post.status === 'PUBLISHED'
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    onClick={() => {
                      if (isSelectable && post.status === 'SCHEDULED') {
                        onEditPost(post)
                      }
                    }}
                  >
                    <div className="text-left flex-grow">
                      <time className="text-lg">
                        {format(new Date(post.scheduledDate), 'HH:mm')}
                      </time>
                      <p className="text-sm truncate">
                        {post.content.substring(0, 20)}...
                      </p>
                    </div>
                  </Card>
                ))
              ) : isPastDay ? (
                <div className="text-center italic text-gray-500">
                  {t('noPostScheduled')}
                </div>
              ) : (
                <Card
                  className="flex items-center justify-between p-4 hover:bg-accent cursor-pointer"
                  onClick={() => {
                    if (isSelectable) {
                      onOpenModal(day)
                    }
                  }}
                >
                  <time className="text-lg">+ {t('newPost')}</time>
                </Card>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
