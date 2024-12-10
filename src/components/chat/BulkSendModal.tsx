'use client'

import { useCallback, useState } from 'react'
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
import { useTranslations } from 'next-intl'
import { useToast } from '@/hooks/use-toast'
import { sendBulkNotifications } from '@/services/actions/notifications/sendBulkNotifications'
import { useParams } from 'next/navigation'

export function BulkSendModal({
  allowedMessageTypes
}: {
  allowedMessageTypes: MessageThreadType[]
}) {
  const t = useTranslations('BulkSend')
  const { toast } = useToast()
  const params = useParams()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [messageType, setMessageType] = useState<MessageThreadType>(
    MessageThreadTypeEnum.Enum.whatsapp
  )

  const handleBulkSend = useCallback(
    async (formData: { message: string }) => {
      setIsLoading(true)
      try {
        const result = await sendBulkNotifications({
          orgId: params.id as string,
          message: formData.message,
          messageType
        })

        if (result.sucess) {
          toast({
            title: t('success'),
            description: t('messagesSentSuccessfully'),
            variant: 'default'
          })
          setOpen(false)
        } else {
          throw new Error('Failed to send messages')
        }
      } catch (error) {
        console.error('Bulk send error:', error)
        toast({
          title: t('error'),
          description: t('errorSendingMessages'),
          variant: 'destructive'
        })
      } finally {
        setIsLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.id, messageType]
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{t('bulkSendButton')}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('bulkSendTitle')}</DialogTitle>
        </DialogHeader>
        <MessageForm
          onSubmit={handleBulkSend}
          messageType={messageType}
          setMessageType={setMessageType}
          allowedMessageTypes={allowedMessageTypes}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
