'use client'

import { useState, useRef, useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { sendUserCommunicationAction } from '@/services/actions/messagesActions'
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
  const scrollAreaRef = useRef<HTMLDivElement>(null)

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
      setMessages(prev => [...prev, newMessage])
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  return (
    <div className="flex flex-col h-full w-full">
      <ScrollArea className="flex-grow" ref={scrollAreaRef}>
        {messages.map(message => (
          <div key={message.id} className="mb-4">
            <p className="font-bold">{message.senderUser?.name || 'Unknown'}</p>
            <p>{message.content}</p>
          </div>
        ))}
      </ScrollArea>
      <MessageForm
        onSubmit={onSubmit}
        messageType={messageType}
        setMessageType={setMessageType}
      />
    </div>
  )
}
