'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { addDays, startOfToday, subDays } from 'date-fns'
import { useTranslations } from 'next-intl'

import { PostTwitterSchema } from '@/schemas/twitterSchema'
import CalendarDay from '../calendarDay/calendarDay'

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between sticky top-0 bg-background pt-4 pb-2">
        <Button variant="outline" size="sm" onClick={() => setStartDate(today)}>
          {t('today')}
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setStartDate(prev => subDays(prev, 5))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setStartDate(prev => addDays(prev, 5))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {days.map(day => (
        <CalendarDay
          key={day.toISOString()}
          day={day}
          posts={posts}
          onOpenModal={onOpenModal}
          onEditPost={onEditPost}
        />
      ))}
    </div>
  )
}
