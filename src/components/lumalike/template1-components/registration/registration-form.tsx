'use client'
import { useEffect, useState } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { translations } from '@/lib/translations/translations'
import { UseFormReturn } from 'react-hook-form'
import { RegistrationInput } from '@/schemas/eventSchema'
import StripeCheckout from '@/components/billing/StripeCheckout'

interface RegistrationFormProps {
  form: UseFormReturn<RegistrationInput>
  onSubmit: (values: RegistrationInput) => Promise<void>
  user: {
    email: string | undefined
    name: string | undefined
  }
  isFreeEvent: boolean
  registrationId?: string
  onPaymentComplete?: () => void
}

export function RegistrationForm({
  form: formProps,
  onSubmit,
  user,
  isFreeEvent,
  registrationId,
  onPaymentComplete
}: RegistrationFormProps) {
  const [showStripeCheckout, setShowStripeCheckout] = useState(false)

  const handleSubmit = async (values: RegistrationInput) => {
    await onSubmit(values)
  }

  useEffect(() => {
    if (registrationId && !isFreeEvent) {
      setShowStripeCheckout(true)
    }
  }, [registrationId, isFreeEvent])

  if (showStripeCheckout && registrationId) {
    return (
      <StripeCheckout
        registrationId={registrationId}
        onComplete={() => {
          setShowStripeCheckout(false)
          onPaymentComplete?.()
        }}
      />
    )
  }

  return (
    <Form {...formProps}>
      <form
        onSubmit={formProps.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        <FormField
          control={formProps.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translations.es.eventFormName}</FormLabel>
              <FormControl>
                <Input
                  placeholder={translations.es.eventFormNamePlaceholder}
                  {...field}
                  disabled={!!user.name}
                  className={user ? 'bg-muted' : ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={formProps.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translations.es.eventFormEmail}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={translations.es.eventFormEmailPlaceholder}
                  {...field}
                  disabled={!!user.email}
                  className={user ? 'bg-muted' : ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {isFreeEvent
            ? translations.es.eventConfirmRegistration
            : translations.es.eventConfirmPurchase}
        </Button>
      </form>
    </Form>
  )
}
