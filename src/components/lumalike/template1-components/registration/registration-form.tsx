/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState, useMemo } from 'react'
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
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LuciaUserType } from '@/schemas/userSchema'

function createCustomFieldsSchema(
  customFields: CustomFieldType[]
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const schemaFields = customFields.reduce<Record<string, z.ZodTypeAny>>(
    (acc, field) => {
      let fieldSchema: z.ZodTypeAny

      switch (field.type) {
        case 'text':
          fieldSchema = z.string({
            required_error: 'Este campo es obligatorio',
            invalid_type_error: 'Debe ser un texto'
          })
          break
        case 'url':
          fieldSchema = z.string({
            required_error: 'Este campo es obligatorio',
            invalid_type_error: 'Debe ser un texto'
          })
          break
        case 'number':
          if (field.required) {
            fieldSchema = z
              .string({
                required_error: 'Este campo es obligatorio',
                invalid_type_error: 'Debe ser un número'
              })
              .min(1, 'Este campo es obligatorio')
              .pipe(
                z.coerce
                  .number({
                    invalid_type_error: 'Debe ser un número'
                  })
                  .refine(val => !isNaN(val), 'Debe ser un número')
              )
          } else {
            fieldSchema = z.union([
              z
                .string()
                .transform(val => (val === '' ? undefined : Number(val)))
                .pipe(z.number().optional()),
              z.number().optional()
            ])
          }
          break
        case 'date':
          fieldSchema = z.date({
            required_error: 'Este campo es obligatorio',
            invalid_type_error: 'Debe ser una fecha válida'
          })
          break
        case 'boolean':
          fieldSchema = z.boolean({
            required_error: 'Este campo es obligatorio',
            invalid_type_error: 'Debe ser un valor booleano'
          })
          break
        default:
          fieldSchema = z.string({
            required_error: 'Este campo es obligatorio',
            invalid_type_error: 'Tipo de campo inválido'
          })
      }

      if (field.required) {
        if (field.type !== 'number') {
          fieldSchema = fieldSchema.refine(
            value => value !== undefined && value !== '',
            'Este campo es obligatorio'
          )
        }
      } else {
        fieldSchema = fieldSchema.optional().or(z.literal(''))
      }

      if (field.type === 'url' && fieldSchema instanceof z.ZodString) {
        fieldSchema = fieldSchema.url('Debe ser una URL válida')
      }

      acc[field.name] = fieldSchema
      return acc
    },
    {}
  )

  return z.object(schemaFields)
}

interface RegistrationFormProps {
  onSubmit: (values: RegistrationInput) => Promise<void>
  user?: LuciaUserType
  isFreeEvent: boolean
  registrationId?: string
  onPaymentComplete?: () => void
  isSubmitting?: boolean
  customFields: CustomFieldType[] | null | undefined
}

export function RegistrationForm({
  onSubmit,
  user,
  isFreeEvent,
  registrationId,
  onPaymentComplete,
  isSubmitting = false,
  customFields
}: RegistrationFormProps): JSX.Element {
  const [showStripeCheckout, setShowStripeCheckout] = useState<boolean>(false)

  const customFieldsSchema = useMemo(
    () =>
      customFields
        ? createCustomFieldsSchema(customFields)
        : z.record(z.unknown()),
    [customFields]
  )

  const schema = z.object({
    name: z.string().min(1, { message: 'Nombre es obligatorio' }),
    email: z.string().email({ message: 'Correo electrónico inválido' }),
    tickets: z.record(z.string(), z.number()),
    customFieldsData: customFieldsSchema
  })

  type FormValues = z.infer<typeof schema>

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      tickets: {},
      customFieldsData: {}
    }
  })

  function handleSubmit(values: FormValues): Promise<void> {
    return onSubmit(values)
  }

  useEffect(() => {
    if (registrationId && !isFreeEvent) {
      setShowStripeCheckout(true)
    }
  }, [registrationId, isFreeEvent])

  const memoizedCustomFields = useMemo(
    () =>
      customFields?.map(field => ({
        ...field,
        defaultValue: ''
      })) ?? [],
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations.es.eventFormName}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={translations.es.eventFormNamePlaceholder}
                      {...field}
                      disabled={!!user?.name || isSubmitting}
                      className={user?.name ? 'bg-muted' : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations.es.eventFormEmail}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={translations.es.eventFormEmailPlaceholder}
                      {...field}
                      disabled={!!user?.email || isSubmitting}
                      className={user?.email ? 'bg-muted' : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {customFields &&
              memoizedCustomFields.map(field => (
                <CustomField
                  key={field.name}
                  field={field}
                  control={form.control}
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
  control: Control<any>
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
          disabled: isSubmitting,
          'aria-required': field.required ? true : undefined
        }

        return (
          <FormItem>
            <FormLabel>
              {field.name}
              {field.required && <span className="text-red-500"> *</span>}
            </FormLabel>

            <FormControl>
              {field.type === 'boolean' ? (
                <Switch
                  checked={formField.value as boolean}
                  onCheckedChange={formField.onChange}
                  {...commonProps}
                />
              ) : field.type === 'date' ? (
                <DatePickerField
                  value={formField.value as Date}
                  onChange={formField.onChange}
                  placeholder={field.defaultValue?.toString()}
                />
              ) : field.inputType === 'longText' ? (
                <Textarea
                  {...formField}
                  placeholder={field.defaultValue?.toString()}
                  {...commonProps}
                  value={formField.value ?? ''}
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
                  value={formField.value ?? ''}
                  onChange={e => {
                    if (field.type === 'number') {
                      formField.onChange(
                        e.target.value === '' ? undefined : e.target.value
                      )
                    } else {
                      formField.onChange(e.target.value)
                    }
                  }}
                />
              )}
            </FormControl>
            {field.description && (
              <p className="text-sm text-muted-foreground mb-2">
                {field.description}
              </p>
            )}
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
            <span>{placeholder || 'Seleccione una fecha'}</span>
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
