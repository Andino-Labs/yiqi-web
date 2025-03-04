import { Card } from '@/components/ui/card'
import { format, isSameDay, isBefore } from 'date-fns'
import { es } from 'date-fns/locale'
import { PostTwitterSchema } from '@/schemas/twitterSchema'
import { useTranslations } from 'next-intl'

interface CalendarDayProps {
  day: Date
  posts: PostTwitterSchema[]
  onOpenModal: (date: Date) => void
  onEditPost: (post: PostTwitterSchema) => void
}

export default function CalendarDay({
  day,
  posts,
  onOpenModal,
  onEditPost
}: CalendarDayProps) {
  const today = new Date()
  const t = useTranslations('ManagementTool')

  const isSelectable = day >= today
  const isPastDay = isBefore(day, today)

  const dayPosts = posts.filter(post =>
    isSameDay(new Date(post.scheduledDate), day)
  )

  const sortedPosts = dayPosts.sort(
    (a, b) =>
      new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
  )

  return (
    <div className="space-y-2">
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
}
