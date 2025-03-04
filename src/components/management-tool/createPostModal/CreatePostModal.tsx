'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'
import { Input } from '@/components/ui/input'
import { DataTwitterSchema, PostTwitterSchema } from '@/schemas/twitterSchema'
import { createTwitterPost } from '@/services/actions/management-tool/channels/twitter/createTwitterPost'
import { deleteTwitterPost } from '@/services/actions/management-tool/channels/twitter/deleteTwitterPost'
import { updateTwitterPost } from '@/services/actions/management-tool/channels/twitter/updateTwitterPost'
import { useTranslations } from 'next-intl'

interface CreatePostModalProps {
  data: DataTwitterSchema
  isOpen: boolean
  onClose: () => void
  selectedDate: Date | null
  onSchedulePost: (post: PostTwitterSchema) => void
  editingPost: PostTwitterSchema | null
  userId: string
  organizationId: string
}

export function CreatePostModal({
  data,
  isOpen,
  onClose,
  selectedDate,
  onSchedulePost,
  editingPost,
  userId,
  organizationId
}: CreatePostModalProps) {
  const [content, setContent] = React.useState('')
  const [scheduleDate, setScheduleDate] = React.useState<Date | null>(
    selectedDate || new Date()
  )
  const [scheduleTime, setScheduleTime] = React.useState('12:00')
  const t = useTranslations('ManagementTool')

  React.useEffect(() => {
    if (editingPost) {
      setContent(editingPost.content)
      setScheduleDate(editingPost.scheduledDate)
      setScheduleTime(format(editingPost.scheduledDate, 'HH:mm'))
    } else {
      setContent('')
      setScheduleDate(selectedDate || new Date())
      setScheduleTime('12:00')
    }
  }, [editingPost, selectedDate])

  const handleSchedulePost = async () => {
    const [hours, minutes] = scheduleTime.split(':').map(Number)
    const scheduledDateTime = new Date(scheduleDate || new Date())
    scheduledDateTime.setHours(hours, minutes)

    if (scheduledDateTime < new Date()) {
      alert('Cannot schedule a post in the past')
      return
    }

    try {
      if (editingPost) {
        const updatedPost = await updateTwitterPost({
          postId: Number(editingPost.id),
          content,
          scheduledDate: scheduledDateTime,
          userId,
          organizationId
        })
        onSchedulePost(updatedPost)
      } else {
        if (!data) {
          alert('Data is not available')
          return
        }
        const post = await createTwitterPost({
          userId: data.userId,
          accountId: data.accountId,
          organizationId: data.organizationId,
          content,
          scheduledDate: scheduledDateTime
        })
        onSchedulePost(post)
        setContent('')
      }
      onClose()
    } catch (error) {
      console.error('Failed to schedule post:', error)
      alert('Error scheduling post. Please try again.')
    }
  }

  const handleDeletePost = async () => {
    if (!editingPost) return

    try {
      await deleteTwitterPost(Number(editingPost.id), userId, organizationId)
      onSchedulePost(editingPost)
      onClose()
    } catch (error) {
      console.error('Failed to delete post:', error)
      alert('Error deleting post. Please try again')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-xs sm:max-w-md p-4 md:p-6 mx-auto rounded-lg">
        <div className="space-y-4 pt-7">
          <Textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={t('whatDoYouFeel')}
            className="min-h-[100px] resize-none border p-2 !outline-none !ring-0 !ring-offset-0 !focus:outline-none !focus:ring-0 !focus:ring-offset-0"
          />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-t pt-4 gap-2">
            <div className="flex flex-wrap items-center pt-4 gap-2">
              <span className="text-sm whitespace-nowrap">
                {t('scheduleFor')}:
              </span>
              <div className="flex w-full gap-2 sm:w-auto">
                <Input
                  type="date"
                  value={scheduleDate ? format(scheduleDate, 'yyyy-MM-dd') : ''}
                  onChange={e =>
                    setScheduleDate(new Date(e.target.value + 'T00:00:00'))
                  }
                  className="w-full"
                />
                <Input
                  type="time"
                  value={scheduleTime}
                  onChange={e => setScheduleTime(e.target.value)}
                  className="w-full sm:w-[100px]"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full md:w-auto"
            >
              {t('cancel')}
            </Button>
            <Button onClick={handleSchedulePost} className="w-full md:w-auto">
              {editingPost ? t('updatePost') : t('schedulePost')}
            </Button>
            {editingPost && (
              <Button
                onClick={handleDeletePost}
                className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white active:bg-red-600"
              >
                {t('delete')}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
