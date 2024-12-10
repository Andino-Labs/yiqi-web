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
      <div className="border-b last:border-b-0">
        <div
          className={`flex flex-row items-start gap-3 p-3 hover:bg-accent ${
            isActive ? 'bg-accent' : ''
          }`}
        >
          <Avatar>
            <AvatarImage src={contextUserPicture ?? ''} alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex flex-col items-start gap-1">
            <div className="w-full flex justify-between items-center">
              <p className="font-bold">{contextUserName}</p>
              {type === 'email' ? (
                <Mail className="h-4 w-4 text-muted-foreground" />
              ) : (
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <p className="text-muted-foreground text-sm line-clamp-2">
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
