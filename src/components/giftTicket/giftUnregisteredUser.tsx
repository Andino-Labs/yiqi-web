'use client'
import { useToast } from '@/hooks/use-toast'
import { createRegistration } from '@/lib/event/createRegistration'
import { RegistrationInput, SavedEventType } from '@/schemas/eventSchema'
import { LuciaUserType } from '@/schemas/userSchema'
import { createNewUser } from '@/services/giftTicket/createAccount'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ToastAction } from '../ui/toast'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel
} from '../ui/form'
import { Input } from '../ui/input'
import { Loader2 } from 'lucide-react'

// form schema for unregistered users

const formSchema = z.object({
  name: z.string(),
  email: z.string()
})

export function GiftUnregisteredUser(props: {
  searchTerm: string | undefined
  event: SavedEventType
  eventId: string | undefined
  senderName: string | undefined
}) {
  const [open, setOpen] = useState<boolean>()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: ''
    }
  })

  const { toast } = useToast()
  const [loading, setLoading] = useState<boolean>(false)
  const [ticketSelections, setTicketSelections] = useState<
    Record<string, number>
  >({})

  // if (!props.event.tickets) throw new Error('no ticket found')
  // const ticket = props.event?.tickets[0]
  const t = useTranslations('Gift')

  const handleQuantityChange = (ticketId: string, change: number) => {
    setTicketSelections(prev => {
      const newQty = Math.max(0, Math.min(5, change))
      console.log(`Updating ticket ${ticketId}: ${0} -> ${newQty}`)
      return { ...prev, [ticketId]: newQty }
    })
  }

  // function to create new user and gift ticket
  const createUser = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
    try {
      setLoading(true)
      // first create new user
      const newUser = await createNewUser(values.name, values.email)

      console.log(ticketSelections)

      // assigning value for the contextUser object based on the newly created user's data
      const contextUser: LuciaUserType = {
        email: values.email as string,
        id: newUser?.id as string,
        name: values.name as string,
        picture: newUser?.picture as string,
        role: 'USER'
      }

      // eventId for the event which ticket will be given out from
      const eventId = props.eventId as string

      // registration object used to create the registration for the selected user
      const registrationInput: RegistrationInput = {
        email: values.email as string,
        name: values.name as string,
        tickets: ticketSelections
      }

      // gifting ticket function

      await createRegistration(
        contextUser,
        eventId,
        registrationInput,
        props.senderName as string
      )
      toast({
        title: `${t('sent')}`,
        description: `${t('sentBody', { userName: values.name })}`,
        action: (
          <ToastAction altText="Goto schedule to undo">{t('ok')}</ToastAction>
        )
      })
      setLoading(false)
      setOpen(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
      toast({
        title: `${t('error')}`,
        description: `${t('errorBody', { userName: values.name })}`,
        action: (
          <ToastAction altText="Goto schedule to undo">{t('ok')}</ToastAction>
        )
      })
    }
  }

  useEffect(() => {
    {
      props.event.tickets?.map(ticket => {
        if (!ticketSelections[ticket.id]) {
          handleQuantityChange(ticket.id, 1)
          console.log(ticketSelections)
        }
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-accent">
          {t('customInvite', { searchTerm: props.searchTerm })}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] flex flex-col justify-start">
        <DialogHeader>
          <DialogTitle className="flex space-x-3">
            {t('customTitle', { searchTerm: props.searchTerm })}
          </DialogTitle>
          <DialogDescription>
            {t('createAccount', { searchTerm: props.searchTerm })}.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-2 justify-start">
          <Form {...form}>
            <form
              className="flex flex-col space-y-3"
              onSubmit={form.handleSubmit(createUser)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('userName')}</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormDescription>
                      {t('nameDesc', { searchTerm: props.searchTerm })}
                    </FormDescription>
                  </FormItem>
                )}
              />
              {/*  email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('email')}</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormDescription>
                      {t('emailDesc', { searchTerm: props.searchTerm })}
                    </FormDescription>
                  </FormItem>
                )}
              />

              <Button className="w-full text-center">
                {loading === true ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  `${t('Submit')}`
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
