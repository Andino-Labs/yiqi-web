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
import { ChevronDown } from 'lucide-react'
import {
  MessageThreadType,
  MessageThreadTypeEnum
} from '@/schemas/messagesSchema'

const formSchema = z.object({
  message: z.string().min(1, {
    message: 'Message must be at least 1 character.'
  })
})

interface MessageFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>
  messageType: MessageThreadType
  setMessageType: (type: MessageThreadType) => void
}

export function MessageForm({
  onSubmit,
  messageType,
  setMessageType
}: MessageFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: ''
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Type your message here." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {messageType === MessageThreadTypeEnum.Enum.whatsapp
                  ? 'WhatsApp'
                  : 'Email'}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() =>
                  setMessageType(MessageThreadTypeEnum.Enum.whatsapp)
                }
              >
                WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setMessageType(MessageThreadTypeEnum.Enum.email)}
              >
                Email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button type="submit">
            Send{' '}
            {messageType === MessageThreadTypeEnum.Enum.whatsapp
              ? 'WhatsApp'
              : 'Email'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
