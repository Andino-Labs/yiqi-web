'use client'
import { useToast } from '@/hooks/use-toast'
import { RegistrationInput, SavedEventType } from '@/schemas/eventSchema'
import { LuciaUserType } from '@/schemas/userSchema'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { ToastAction } from '../ui/toast'
import { createRegistration } from '@/lib/event/createRegistration'
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

export function GiftUser(props: {
  userName: string | undefined
  userId: string | undefined
  email: string | undefined
  eventId: string | undefined
  picture: string | undefined
  event: SavedEventType
  senderName: string | undefined
}) {
  const { toast } = useToast()
  const [loading, setLoading] = useState<boolean>(false)
  const [ticketSelections, setTicketSelections] = useState<
    Record<string, number>
  >({})

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
                  registrationInput
                  //   props.senderName as string  // this part is commented out because the email template is not on this branch. when we merge i will include it as an optional prop in the server action. This prop enables the reciever to know the name of the sender.
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
