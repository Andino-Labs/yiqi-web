'use client'

import { SearchUser } from '@/services/giftTicket/searchUser'
import { Input } from '../ui/input'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { EllipsisVertical, Loader2 } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '../ui/button'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { LuciaUserType } from '@/schemas/userSchema'
import { RegistrationInput } from '@/schemas/eventSchema'

import { useToast } from '@/hooks/use-toast'
import { ToastAction } from '../ui/toast'
import { EventType } from '@/services/actions/event/getEvent'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel
} from '../ui/form'
import { z } from 'zod'
import { createNewUser } from '@/services/giftTicket/createAccount'
import { useTranslations } from 'next-intl'
import { createRegistration } from '@/lib/event/createRegistration'

export interface SearchResults {
  name: string | undefined
  email: string | undefined
  id: string | undefined
  picture: string | undefined | null
}

// form schema for unregistered users

const formSchema = z.object({
  name: z.string(),
  email: z.string()
})

export default function GiftTicket(props: {
  eventId: string | undefined
  event: EventType
  senderName: string | undefined
}) {
  const [results, setResults] = useState<SearchResults[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const t = useTranslations('Gift')

  async function search(value: string) {
    setSearchTerm(value)
    if (value.trim() === '') {
      setResults([]) // Clear results if search input is empty
      return
    }
    const search = await SearchUser(value)
    setResults(search)
  }
  return (
    <div className="flex flex-col space-y-3">
      {/* title and description */}
      <div className="">
        <h2 className="text-xl font-semibold mb-2">{t('gift')}</h2>
        <p className="text-muted-foreground">{t('giftBody')}</p>
      </div>

      {/* form */}
      <div className="flex flex-col space-y-3">
        <div className="flex justify-start flex-col">
          <label htmlFor="search">{t('Search')}</label>
          <Input
            type="text"
            placeholder="search username or email"
            onChange={e => search(e.target.value)}
          />
        </div>

        {searchTerm && results && results.length > 0 && (
          <div>
            <h3 className="font-semibold mt-3">{t('results')}</h3>
            <ul className="space-y-2 w-full bg-accent/60 p-5 rounded-2xl">
              {results.map((result, index) => (
                <li
                  key={index}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    {result.picture && (
                      <div className="w-10 h-10 rounded-full relative">
                        <Image
                          src={result.picture}
                          alt={result.name || 'User'}
                          className="object-cover rounded-full"
                          fill
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{result.name || 'No Name'}</p>
                      <p className="text-sm text-muted-foreground">
                        {result.email}
                      </p>
                    </div>
                  </div>
                  <GiftUser
                    userName={result.name}
                    email={result.email}
                    picture={result.picture as string}
                    userId={result.id}
                    eventId={props.eventId as string}
                    event={props.event!}
                    senderName={props.senderName}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* No Results */}
        {searchTerm && results && results.length === 0 && (
          <div className="w-full flex items-center justify-center">
            <div className="flex flex-col space-y-2 justify-center">
              <p className="text-sm text-muted-foreground mt-3 text-center">
                {t('noResults', { searchTerm })}.
              </p>
              <GiftUnregisteredUser
                searchTerm={searchTerm as string}
                event={props.event!}
                eventId={props.eventId}
                senderName={props.senderName}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// modal for registered user

function GiftUser(props: {
  userName: string | undefined
  userId: string | undefined
  email: string | undefined
  eventId: string | undefined
  picture: string | undefined
  event: EventType
  senderName: string | undefined
}) {
  const { toast } = useToast()
  const [loading, setLoading] = useState<boolean>(false)
  const [ticketSelections, setTicketSelections] = useState<
    Record<string, number>
  >({})

  if (!props.event?.tickets) throw new Error('no ticket found')
  const ticket = props.event.tickets[0]

  const t = useTranslations('Gift')

  // code to update quantity of ticket
  const handleQuantityChange = (ticketId: string, change: number) => {
    setTicketSelections(prev => {
      const newQty = Math.max(0, Math.min(5, change))
      console.log(`Updating ticket ${ticketId}: ${0} -> ${newQty}`)
      return { ...prev, [ticketId]: newQty }
    })
  }



  // assigning value for the contextUser object
  const contextUser: LuciaUserType = {
    email: props.email as string,
    id: props.userId as string,
    name: props.userName as string,
    picture: props.picture as string,
    role: 'USER'
  }

  // eventId for the event which ticket will be given out from
  const eventId = props.eventId as string

  // registration object used to create the registration for the selected user
  const registrationInput: RegistrationInput = {
    email: props.email as string,
    name: props.userName as string,
    tickets: ticketSelections
  }

  const [open, setOpen] = useState<boolean>()

  useEffect(() => {
    if (!ticketSelections[ticket.id]) {
      handleQuantityChange(ticket.id, 1)
      console.log(ticketSelections)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket])
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <EllipsisVertical className="stroke-accent-foreground cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] flex flex-col justify-start">
        <DialogHeader>
          <DialogTitle className="flex space-x-3">
            {t('giftTo', { userName: props.userName })}
          </DialogTitle>
          <DialogDescription>
            {t('giftDesc', { userName: props.userName })}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-start">
          <Button
            type="submit"
            onClick={async function submit() {
              setLoading(true)
              console.log('loading')
              try {
                await createRegistration(
                  contextUser,
                  eventId,
                  registrationInput,
                  props.senderName as string
                )

                toast({
                  title: `${t('sent')}`,
                  description: `${t('sentBody', { userName: props.userName })}`,
                  action: (
                    <ToastAction altText="Goto schedule to undo">
                      {t('ok')}
                    </ToastAction>
                  )
                })
                setLoading(false)
                setOpen(false)
              } catch (error) {
                console.log(error)
                setLoading(false)
                toast({
                  title: `${t('error')}`,
                  description: `${t('errorBody', { userName: props.userName })}`,
                  action: (
                    <ToastAction altText="Goto schedule to undo">
                      {t('ok')}
                    </ToastAction>
                  )
                })
              }
            }}
          >
            {loading === true ? (
              <Loader2 className="animate-spin" />
            ) : (
              <p>{t('gift')}</p>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// modal for unregistered users

function GiftUnregisteredUser(props: {
  searchTerm: string | undefined
  event: EventType
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

  if (!props.event.tickets) throw new Error('no ticket found')
  const ticket = props.event?.tickets[0]

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
    if (!ticketSelections[ticket.id]) {
      handleQuantityChange(ticket.id, 1)
      console.log(ticketSelections)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket])

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
