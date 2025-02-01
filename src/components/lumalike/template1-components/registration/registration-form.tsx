'use client'

import { useEffect, useState, useMemo } from 'react'
import type { UseFormReturn } from 'react-hook-form'
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
import type { CustomFieldType, RegistrationInput } from '@/schemas/eventSchema'
import StripeCheckout from '@/components/billing/StripeCheckout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Control } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'

interface RegistrationFormProps {
  form: UseFormReturn<RegistrationInput>
  onSubmit: (values: RegistrationInput) => Promise<void>
  user: { name?: string; picture?: string; email?: string; role?: string }
  isFreeEvent: boolean
  registrationId?: string
  onPaymentComplete?: () => void
  isSubmitting?: boolean
  customFields: CustomFieldType[]
}

export function RegistrationForm({
  form: formProps,
  onSubmit,
  user,
  isFreeEvent,
  registrationId,
  onPaymentComplete,
  isSubmitting = false,
  customFields
}: RegistrationFormProps): JSX.Element {
  const [showStripeCheckout, setShowStripeCheckout] = useState<boolean>(false)

  function handleSubmit(values: RegistrationInput): Promise<void> {
    return onSubmit(values)
  }

  useEffect(() => {
    if (registrationId && !isFreeEvent) {
      setShowStripeCheckout(true)
    }
  }, [registrationId, isFreeEvent])

  const memoizedCustomFields = useMemo(
    () =>
      customFields.map(field => ({
        ...field,
        defaultValue: field.defaultValue?.toString()
      })),
    [customFields]
  )

  if (registrationId && showStripeCheckout && !isFreeEvent) {
    return (
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle>{translations.es.eventPayment}</CardTitle>
        </CardHeader>
        <CardContent>
          <StripeCheckout
            registrationId={registrationId}
            onComplete={() => {
              setShowStripeCheckout(false)
              onPaymentComplete?.()
            }}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>{translations.es.eventRegistration}</CardTitle>
      </CardHeader>
      <CardContent>
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
                      disabled={!!user.name || isSubmitting}
                      className={user.name ? 'bg-muted' : ''}
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
                      disabled={!!user.email || isSubmitting}
                      className={user.email ? 'bg-muted' : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {memoizedCustomFields.map(field => (
              <CustomField
                key={field.name}
                field={field}
                control={formProps.control}
                isSubmitting={isSubmitting}
              />
            ))}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {isFreeEvent
                    ? translations.es.eventConfirmRegistration
                    : translations.es.eventConfirmPurchase}
                </div>
              ) : isFreeEvent ? (
                translations.es.eventConfirmRegistration
              ) : (
                translations.es.eventConfirmPurchase
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

interface CustomFieldProps {
  field: CustomFieldType
  control: Control<RegistrationInput>
  isSubmitting: boolean
}

export function CustomField({
  field,
  control,
  isSubmitting
}: CustomFieldProps): JSX.Element {
  return (
    <FormField
      control={control}
      name={`customFieldsData.${field.name}`}
      render={({ field: formField }) => {
        const commonProps = {
          required: field.required,
          disabled: isSubmitting
        }

        return (
          <FormItem>
            <FormLabel>{field.name}</FormLabel>
            {field.description && (
              <p className="text-sm text-muted-foreground mb-2">
                {field.description}
              </p>
            )}
            <FormControl>
              {field.type === 'boolean' ? (
                <Switch
                  checked={!!formField.value}
                  onCheckedChange={formField.onChange}
                  {...commonProps}
                />
              ) : field.type === 'date' ? (
                <DatePickerField
                  value={formField.value}
                  onChange={formField.onChange}
                  placeholder={field.defaultValue?.toString()}
                />
              ) : field.inputType === 'longText' ? (
                <Textarea
                  {...formField}
                  placeholder={field.defaultValue?.toString()}
                  {...commonProps}
                />
              ) : (
                <Input
                  {...formField}
                  type={
                    field.type === 'number'
                      ? 'number'
                      : field.type === 'url'
                        ? 'url'
                        : 'text'
                  }
                  placeholder={field.defaultValue?.toString()}
                  min={field.type === 'number' ? 0 : undefined}
                  step={field.type === 'number' ? 'any' : undefined}
                  {...commonProps}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

interface DatePickerFieldProps {
  value?: Date
  onChange: (date?: Date) => void
  placeholder?: string
}

export function DatePickerField({
  value,
  onChange,
  placeholder
}: DatePickerFieldProps): JSX.Element {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            format(value, 'PPP')
          ) : (
            <span>{placeholder || 'Select date'}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
