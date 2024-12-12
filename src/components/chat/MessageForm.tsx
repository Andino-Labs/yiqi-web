'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Loader2 } from 'lucide-react'
import {
  MessageThreadType,
  MessageThreadTypeEnum
} from '@/schemas/messagesSchema'
import { translations } from '@/lib/translations/translations'
import { useTranslations } from 'next-intl'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  message: z.string().min(1, {
    message: translations.es.messageMinLength
  })
})

interface MessageFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>
  messageType: MessageThreadType
  setMessageType: (type: MessageThreadType) => void
  allowedMessageTypes: MessageThreadType[]
  isLoading?: boolean
}

export function MessageForm({
  onSubmit,
  messageType,
  setMessageType,
  allowedMessageTypes,
  isLoading = false
}: MessageFormProps) {
  const t = useTranslations('BulkSend')
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: ''
    }
  })

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await onSubmit(values)
      form.reset()
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        variant: 'destructive',
        // TODO: Add error handling
        title: t('error'),
        description: t('errorSendingMessage')
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="border-t space-y-4 p-4"
      >
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder={t('typeYourMessage')}
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={isLoading}>
                {messageType === MessageThreadTypeEnum.Enum.whatsapp
                  ? `${t('whatsapp')}`
                  : `${t('email')}`}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {allowedMessageTypes.map(type => (
                <DropdownMenuItem
                  onClick={() => setMessageType(type)}
                  key={type}
                >
                  {t(type)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant={'outline'} type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('sending')}
              </>
            ) : (
              t('send')
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
