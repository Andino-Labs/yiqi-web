'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  sendUserCommunicationAction,
  getUserMessageList
} from '@/services/actions/messagesActions'
import {
  MessageList,
  MessageThreadType,
  MessageThreadTypeEnum
} from '@/schemas/messagesSchema'
import { MessageForm } from './MessageForm'

export default function ConnectedChat({
  defaultMessages,
  userId,
  orgId
}: {
  defaultMessages: MessageList
  userId: string
  orgId: string
}) {
  const [messages, setMessages] = useState(defaultMessages)
  const [messageType, setMessageType] = useState<MessageThreadType>(
    defaultMessages.at(0)?.messageThread.type ||
      MessageThreadTypeEnum.Enum.whatsapp
  )
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  const loadMoreMessages = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const oldestMessageId = messages[messages.length - 1]?.id
      const olderMessages = await getUserMessageList(
        userId,
        orgId,
        oldestMessageId
      )

      if (olderMessages.length === 0) {
        setHasMore(false)
      } else {
        setMessages(prevMessages => [...prevMessages, ...olderMessages])
      }
    } catch (error) {
      console.error('Failed to load more messages:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, hasMore, messages, userId, orgId])

  useEffect(() => {
    const options = {
      root: scrollAreaRef.current,
      rootMargin: '0px',
      threshold: 1.0
    }

    observerRef.current = new IntersectionObserver(entries => {
      const [entry] = entries
      if (entry.isIntersecting) {
        loadMoreMessages()
      }
    }, options)

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [loadMoreMessages])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  async function onSubmit(values: { message: string }) {
    try {
      const newMessage = await sendUserCommunicationAction({
        destinationUserId: userId,
        content: values.message,
        messageType: messageType,
        orgId: orgId
      })
      setMessages(prev => [newMessage, ...prev])
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  return (
    <div className="flex flex-col h-full w-full">
      <ScrollArea className="flex-grow" ref={scrollAreaRef}>
        {isLoading && <div ref={loadingRef}>Loading more messages...</div>}
        {messages
          .map(message => (
            <div key={message.id} className="mb-4">
              <p className="font-bold">{message.messageThread.type}</p>
              <p className="font-bold">
                {message.senderUser?.name || 'Unknown'}
              </p>
              <p>{message.content}</p>
            </div>
          ))
          .reverse()}
      </ScrollArea>
      <MessageForm
        onSubmit={onSubmit}
        messageType={messageType}
        setMessageType={setMessageType}
      />
    </div>
  )
}
