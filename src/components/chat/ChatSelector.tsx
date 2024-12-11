'use client'

import { OrgMessageListItemSchemaType } from '@/schemas/messagesSchema'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, MessageSquare } from 'lucide-react'
import { useStripHtml } from '@/lib/utils/html'

export default function ChatSelector({
  contextUserName,
  lastMessage,
  contextUserId,
  contextUserPicture,
  type,
  isActive = false
}: OrgMessageListItemSchemaType & { isActive?: boolean }) {
  const orgId = useParams().id
  const stripHtml = useStripHtml({ html: lastMessage?.content || '' })

  function getPreviewText(content: string): string {
    const strippedContent = type === 'email' ? stripHtml : content
    const words = strippedContent.split(' ')
    const first10Words = words.slice(0, 10)
    return first10Words.join(' ') + (words.length > 10 ? '...' : '')
  }

  return (
    <Link href={`/admin/organizations/${orgId}/chat/${contextUserId}`}>
      <div
        className={`border-b last:border-b-0 transition-all ${
          isActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
            : 'hover:bg-sidebar-accent/60'
        }`}
      >
        <div className="flex items-center gap-3 p-4">
          <Avatar>
            <AvatarImage src={contextUserPicture ?? ''} alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <p className="font-bold dark:text-gray-400">{contextUserName}</p>
              {type === 'email' ? (
                <Mail className="h-5 w-5 text-gray-400" />
              ) : (
                <MessageSquare className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <p className="text-gray-600 text-sm truncate">
              {lastMessage
                ? getPreviewText(lastMessage.content)
                : 'No messages'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
