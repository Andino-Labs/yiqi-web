'use client'
import { useState, useEffect, useCallback } from 'react'
import { CreatePostModal } from '@/components/management-tool/createPostModal/CreatePostModal'
import { Header } from './header/header'
import { Calendar } from './calendar/calendar'
import { Analytics } from './analytics/analytics'
import { Card } from '../ui/card'

import { DataTwitterSchema, PostTwitterSchema } from '@/schemas/twitterSchema'
import { getTwitterPostsByUserId } from '@/services/actions/management-tool/channels/twitter/getTwitterPostsByUserId'

interface User {
  id: string
}

interface AnalyticsProps {
  comments: number
  likes: number
  shares: number
  impressions: number
}

export default function CalendarPage({
  data,
  user,
  analytics
}: {
  data: DataTwitterSchema
  user: User
  analytics: AnalyticsProps | null
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [scheduledPosts, setScheduledPosts] = useState<PostTwitterSchema[]>([])
  const [editingPost, setEditingPost] = useState<PostTwitterSchema | null>(null)
  const [view, setView] = useState<'calendar' | 'analytics'>('calendar')

  const fetchPosts = useCallback(async () => {
    const posts = await getTwitterPostsByUserId(user.id)
    setScheduledPosts(posts)
  }, [user.id])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleOpenModal = (date: Date) => {
    setSelectedDate(date)
    setEditingPost(null)
    setIsModalOpen(true)
  }

  const handleSchedulePost = (post: PostTwitterSchema) => {
    setScheduledPosts(prev => {
      const index = prev.findIndex(p => p.id === post.id)
      if (index !== -1) {
        const newPosts = [...prev]
        newPosts[index] = post
        return newPosts
      } else {
        return [...prev, post]
      }
    })
  }

  const handleEditPost = (post: PostTwitterSchema) => {
    setEditingPost(post)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    fetchPosts()
  }

  return (
    <Card className="bg-background w-full">
      <Header
        onNewPost={() => handleOpenModal(new Date())}
        openAnalytics={() => setView('analytics')}
        openCalendar={() => setView('calendar')}
        data={data}
      />
      <main className="container mx-auto p-4">
        {view === 'calendar' ? (
          <Calendar
            onSelectDate={setSelectedDate}
            selectedDate={selectedDate}
            onOpenModal={handleOpenModal}
            scheduledPosts={scheduledPosts}
            onEditPost={handleEditPost}
            posts={scheduledPosts}
          />
        ) : (
          <Analytics analytics={analytics} />
        )}
      </main>
      <CreatePostModal
        data={data}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedDate={selectedDate}
        onSchedulePost={handleSchedulePost}
        editingPost={editingPost}
      />
    </Card>
  )
}
