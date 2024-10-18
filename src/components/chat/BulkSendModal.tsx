'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { MessageForm } from './MessageForm'
import {
  MessageThreadType,
  MessageThreadTypeEnum
} from '@/schemas/messagesSchema'

export function BulkSendModal() {
  const [messageType, setMessageType] = useState<MessageThreadType>(
    MessageThreadTypeEnum.Enum.whatsapp
  )

  const handleBulkSend = async (values: { message: string }) => {
    // Implement bulk send logic here
    console.log('Bulk send:', values.message, messageType)
    // Close the modal after sending
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Envío masivo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Envío masivo</DialogTitle>
        </DialogHeader>
        <MessageForm
          onSubmit={handleBulkSend}
          messageType={messageType}
          setMessageType={setMessageType}
        />
      </DialogContent>
    </Dialog>
  )
}
