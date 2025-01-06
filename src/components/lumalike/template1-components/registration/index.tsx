'use client'

import { useEffect, useState } from 'react'
import { Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import {
  PublicEventType,
  registrationInputSchema,
  type RegistrationInput,
  type EventRegistrationSchemaType
} from '@/schemas/eventSchema'
import { TicketSelection } from './ticket-selection'
import { RegistrationSummary } from './registration-summary'
import { RegistrationConfirmation } from './registration-confirmation'
import { checkExistingRegistration } from '@/services/actions/event/checkExistingRegistration'
import { createRegistration } from '@/services/actions/event/createRegistration'
import { toast } from '@/hooks/use-toast'
import { RegistrationForm } from './registration-form'
import { markRegistrationPaid } from '@/services/actions/event/markRegistrationPaid'
import { useTranslations } from 'next-intl'
import { PaymentConfirmed } from './payment-confirmed'

export type RegistrationProps = {
  event: PublicEventType
  user: {
    email: string | undefined
    name: string | undefined
  }
  dialogTriggerRef?: React.RefObject<HTMLButtonElement> | null
}

export function Registration({
  event,
  user,
  dialogTriggerRef
}: RegistrationProps) {
  const [ticketSelections, setTicketSelections] = useState<
    Record<string, number>
  >({})
  const t = useTranslations('RegistrationComponent')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [existingRegistration, setExistingRegistration] =
    useState<EventRegistrationSchemaType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentRegistrationId, setCurrentRegistrationId] = useState<
    string | undefined
  >()
  const [paymentCompleted, setPaymentCompleted] = useState(false)

  const form = useForm<RegistrationInput>({
    resolver: zodResolver(registrationInputSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      tickets: {}
    }
  })

  useEffect(() => {
    async function checkRegistration() {
      const registration = await checkExistingRegistration(event.id)
      setExistingRegistration(registration)

      setIsLoading(false)
    }
    checkRegistration()
  }, [event.id, user?.email])

  const handleQuantityChange = (ticketId: string, change: number) => {
    setTicketSelections(prev => {
      const currentQty = prev[ticketId] || 0
      const newQty = Math.max(0, Math.min(5, currentQty + change))
      return { ...prev, [ticketId]: newQty }
    })
  }

  const calculateTotal = () => {
    return event.tickets.reduce((total, ticket) => {
      const quantity = ticketSelections[ticket.id] || 0
      return total + ticket.price * quantity
    }, 0)
  }

  const hasSelectedTickets = Object.values(ticketSelections).some(
    qty => qty > 0
  )
  const isFreeEvent = event.tickets.every(ticket => ticket.price === 0)

  const onSubmit = async (values: RegistrationInput) => {
    if (!hasSelectedTickets) {
      toast({
        title: `${t('eventNoTicketsSelected')}`,
        variant: 'destructive'
      })
      return
    }

    try {
      setIsSubmitting(true)
      const result = await createRegistration(event.id, {
        ...values,
        tickets: ticketSelections
      })

      if (result.success && result.registration) {
        if (isFreeEvent) {
          setPaymentCompleted(true)
          setIsDialogOpen(false)
        } else {
          // Store registration ID for payment
          setCurrentRegistrationId(result.registration.id)
        }
      } else {
        toast({
          title: result.error,
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error submitting registration:', error)
      toast({
        title: `${t('eventRegistrationError')}`,
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePaymentComplete = async () => {
    try {
      setIsSubmitting(true)
      const result = await markRegistrationPaid(currentRegistrationId!)
      if (result.success) {
        setPaymentCompleted(true)
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      toast({
        title: 'Error processing payment',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (paymentCompleted && currentRegistrationId) {
    return <PaymentConfirmed eventId={event.id} />
  }

  if (existingRegistration) {
    const requiresPayment = !event.tickets.every(ticket => ticket.price === 0)
    return (
      <RegistrationConfirmation
        registration={existingRegistration}
        requiresPayment={requiresPayment}
      />
    )
  }

  return (
    <Card className="bg-primary-foreground/10 backdrop-blur-sm">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-2">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="font-semibold text-lg mb-1 text-white">
              {isFreeEvent
                ? `${t('eventFreeRegistration')}`
                : `${t('eventRegistration')}`}
            </div>
            <p className="text-sm text-muted-foreground text-white">
              {isFreeEvent
                ? `${t('eventFreeRegistrationDescription')}`
                : `${t('eventRegistrationDescription')}`}
            </p>
          </div>
        </div>

        <Separator className="bg-white/20" />

        <TicketSelection
          tickets={event.tickets}
          ticketSelections={ticketSelections}
          onQuantityChange={handleQuantityChange}
          hasSelectedTickets={hasSelectedTickets}
          calculateTotal={calculateTotal}
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              ref={dialogTriggerRef}
              size="lg"
              className="w-full text-black font-extrabold bg-cyan-300 hover:bg-cyan-700"
              disabled={!hasSelectedTickets}
            >
              {isFreeEvent ? `${t('eventRegister')}` : `${t('eventPurchase')}`}
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">
                {t('eventRegistrationSummary')}
              </DialogTitle>
              <DialogDescription>
                {user
                  ? `${t('eventRegistrationDescriptionLoggedIn')}`
                  : `${t('eventRegistrationDescription')}`}
              </DialogDescription>
            </DialogHeader>

            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <RegistrationSummary
                tickets={event.tickets}
                ticketSelections={ticketSelections}
                calculateTotal={calculateTotal}
              />
              <RegistrationForm
                form={form}
                onSubmit={onSubmit}
                user={user}
                isFreeEvent={isFreeEvent}
                registrationId={currentRegistrationId}
                onPaymentComplete={handlePaymentComplete}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
