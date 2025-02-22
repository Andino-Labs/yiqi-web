import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isToday,
  parse,
  startOfMonth,
  startOfToday,
} from 'date-fns'
import { useState } from 'react'
import { useMediaQuery } from '@mantine/hooks'
import { MobileCalendarView } from '../mobileCalendar/MobileCalendar'
import { PostTwitterSchema } from '@/schemas/twitterSchema'
import { useTranslations } from 'next-intl'

interface CalendarProps {
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
  onOpenModal: (date: Date) => void
  scheduledPosts?: PostTwitterSchema[]
  onEditPost: (post: PostTwitterSchema) => void
  posts: PostTwitterSchema[]
}

export function Calendar({ selectedDate, onSelectDate, onOpenModal, onEditPost, posts }: CalendarProps) {
  const today = startOfToday()
  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
  const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())
  const isMobile = useMediaQuery("(max-width: 768px)")
  const t = useTranslations('ManagementTool')

  const days = eachDayOfInterval({
    start: startOfMonth(firstDayCurrentMonth),
    end: endOfMonth(firstDayCurrentMonth),
  })

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
  }

  function isDateSelectable(date: Date) {
    return date >= today
  }

  if (isMobile) {
    return (
      <MobileCalendarView
        onOpenModal={onOpenModal}
        posts={posts}
        onEditPost={onEditPost}
      />
    );
  }

  return (
    <div className="pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">{format(firstDayCurrentMonth, 'MMMM yyyy')}</h2>
          <Button variant="outline" size="sm" onClick={() => setCurrentMonth(format(today, 'MMM-yyyy'))}>
            {t('today')}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-7 gap-px rounded-lg bg-muted text-center text-sm md:grid-cols-7">
        <div className="py-2 font-semibold">Sunday</div>
        <div className="py-2 font-semibold">Monday</div>
        <div className="py-2 font-semibold">Tuesday</div>
        <div className="py-2 font-semibold">Wednesday</div>
        <div className="py-2 font-semibold">Thursday</div>
        <div className="py-2 font-semibold">Friday</div>
        <div className="py-2 font-semibold">Saturday</div>
      </div>

      <div className="mt-2 md:grid md:grid-cols-7 grid-flow-row sm:block">
        {days.map((day, dayIdx) => {
          const isSelectable = isDateSelectable(day);
          const dayPosts = posts.filter(post => isSameDay(new Date(post.scheduledDate), day)) || [];
          const sortedPosts = dayPosts.length > 0 ? dayPosts.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()) : [];

          return (
            <div
              key={day.toString()}
              className={cn(
                'relative bg-background py-2 px-1 min-h-[120px] sm:mb-2 md:mb-0',
                dayIdx === 0 && colStartClasses[getDay(day)],
              )}
            >
              <Button
                variant="ghost"
                className={cn(
                  'absolute top-1 right-1 h-8 w-8 rounded-full p-0',
                  !isSelectable && 'cursor-not-allowed opacity-50',
                  isEqual(day, selectedDate as Date) && 'bg-primary text-primary-foreground',
                  isToday(day) && 'bg-blue-600 text-white',
                  !isEqual(day, selectedDate as Date) && !isToday(day) && 'hover:bg-muted',
                )}
                disabled={!isSelectable}
                onClick={() => {
                  if (isSelectable) {
                    onSelectDate(day);
                    onOpenModal(day);
                  }
                }}
              >
                <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
              </Button>

              <div className="mt-8 space-y-2">
                {sortedPosts.map(post => (
                  <div
                    key={post.id}
                    className={cn(
                      'text-xs p-1 rounded flex justify-between items-center',
                      post.status === 'SCHEDULED' && 'bg-blue-500',
                      post.status === 'PUBLISHED' && 'bg-green-500',
                    )}
                  >
                    <button
                      onClick={() => post.status !== 'PUBLISHED' && onEditPost(post)}
                      disabled={post.status === 'PUBLISHED'}
                      className={cn('text-left flex-grow overflow-hidden', post.status === 'PUBLISHED' && 'cursor-not-allowed')}
                    >
                      <span className="inline-block truncate">
                        {format(new Date(post.scheduledDate), 'HH:mm')} - {post.content.substring(0, 20)}...
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
];
