'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { createEvent } from '@/services/actions/event/createEvent'
import {
  CustomFieldType,
  EventInputSchema,
  EventInputType,
  EventTicketInputType,
  EventTypeEnum,
  SavedEventType,
  SavedTicketOfferingType
} from '@/schemas/eventSchema'
import { useRouter } from 'next/navigation'
import { MapPin, Clock, Users, Link as LinkIcon } from 'lucide-react'
import { useState } from 'react'
import { TicketTypesManager } from './TicketTypesManager'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { UploadToS3 } from '@/lib/uploadToS3'
import Image from 'next/image'
import { AddressAutocomplete } from '../forms/AddressAutocomplete'
import { getLocationDetails } from '@/lib/utils'
import { updateEvent } from '@/services/actions/event/updateEvent'
import { MarkdownEditor } from './editor/mdEditor'
import { useTranslations } from 'next-intl'
import { UploadIcon } from '@radix-ui/react-icons'
import { Switch } from '@/components/ui/switch'
import Link from 'next/link'
import { allTimezones, useTimezoneSelect } from 'react-timezone-select'
import { extractGMTTime, getDateOrTimeByTimezoneLabel } from '../utils'
import { CustomFieldsDialog } from './CustomFieldsDialog'
import { updateCustomFields } from '@/services/actions/event/updateCustomFields'
import { useToast } from '@/hooks/use-toast'

type Props = {
  organizationId: string
  event?: SavedEventType
}

export const EventFormInputSchema = EventInputSchema.extend({
  startTime: z.string(),
  endTime: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  timezoneLabel: z.string()
}).superRefine((data, ctx) => {
  if (data.type === EventTypeEnum.IN_PERSON && !data.location) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Location is required for in-person events',
      path: ['location']
    })
  }
  if (data.type === EventTypeEnum.ONLINE) {
    if (!data.virtualLink) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Virtual link is required for online events',
        path: ['virtualLink']
      })
    } else if (!z.string().url().safeParse(data.virtualLink).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid URL format',
        path: ['virtualLink']
      })
    }
  }
})

type LocationDetails = {
  city: string
  state: string
  country: string
  latLon: {
    lat: number
    lon: number
  }
}

export function EventForm({ organizationId, event }: Props) {
  const { toast } = useToast()
  const currentDate = new Date()
  const localCurrentDate = new Date(
    currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
  )
  const defaultStartDateStr = localCurrentDate.toLocaleDateString('en-CA')
  const defaultStartTimeStr = localCurrentDate
    .toISOString()
    .split('T')[1]
    .slice(0, 5)
  const defaultEndDate = new Date(localCurrentDate.getTime() + 10 * 60 * 1000)
  const defaultMinEndDateStr = defaultEndDate.toLocaleDateString('en-CA')
  const defaultMinEndTimeStr = defaultEndDate
    .toISOString()
    .split('T')[1]
    .slice(0, 5)

  const router = useRouter()
  const t = useTranslations('DeleteAccount')
  const tPage = useTranslations('EventsPage')
  const [tickets, setTickets] = useState<
    EventTicketInputType[] | SavedTicketOfferingType[]
  >(
    event?.tickets ?? [
      {
        name: 'General',
        category: 'GENERAL',
        description: '',
        price: 0,
        limit: 100,
        ticketsPerPurchase: 1
      }
    ]
  )
  const defaultValue = `
  <h1>${tPage('defaultValueH1')}</h1>
  <p>
    ${tPage('defaultValueP') + ' '}<strong>${tPage('defaultValueStrong') + ', '}</strong>
    <em>${tPage('defaultValueItalic') + ', '}</em>
    ${' ' + tPage('defaultValueP2') + '.'}
  </p>
  `
  const [loading, setLoading] = useState(false)
  const [showTicketManager, setShowTicketManager] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(
    event?.openGraphImage ?? null
  )
  const [minStartTime, setMinStartTime] = useState<string | number>(
    event ? '00:00' : defaultStartTimeStr
  )
  const [minEndDate, setMinEndDate] = useState<string | number>(
    defaultMinEndDateStr
  )
  const [minEndTime, setMinEndTime] = useState<string | number>(
    event ? '00:00' : defaultMinEndTimeStr
  )
  const [description, setDescription] = useState<string>(
    event?.description ?? defaultValue
  )

  const { options } = useTimezoneSelect({
    timezones: allTimezones
  })
  const [locationDetails, setLocationDetails] =
    useState<LocationDetails | null>(null)

  const [showCustomFieldsDialog, setShowCustomFieldsDialog] = useState(false)
  const [customFields, setCustomFields] = useState<CustomFieldType[]>(
    event?.customFields?.fields ?? []
  )
  const form = useForm<z.infer<typeof EventFormInputSchema>>({
    resolver: zodResolver(EventFormInputSchema),
    defaultValues: {
      title: event?.title ?? '',
      startDate: event
        ? getDateOrTimeByTimezoneLabel(
            event.startDate,
            event.timezoneLabel,
            'date'
          )
        : '',
      startTime: event
        ? getDateOrTimeByTimezoneLabel(
            event.startDate,
            event.timezoneLabel,
            'time'
          )
        : '',
      endDate: event
        ? getDateOrTimeByTimezoneLabel(
            event.endDate,
            event.timezoneLabel,
            'date'
          )
        : '',
      endTime: event
        ? getDateOrTimeByTimezoneLabel(
            event.endDate,
            event.timezoneLabel,
            'time'
          ).slice(0, 5)
        : '',
      location: event?.location ?? '',
      virtualLink: event?.virtualLink ?? '',
      description: event?.description ?? 'XYZMON',
      requiresApproval: event?.requiresApproval ?? false,
      openGraphImage: event?.openGraphImage ?? null,
      maxAttendees: event?.maxAttendees ?? undefined,
      type: event?.type ?? EventTypeEnum.IN_PERSON,
      timezoneLabel:
        event?.timezoneLabel ??
        options.filter(
          option =>
            option.offset &&
            option.offset === -new Date().getTimezoneOffset() / 60
        )[0].label
    }
  })

  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [savedEventId, setSavedEventId] = useState<string | null>(null)

  function handleAddCustomField(field: CustomFieldType) {
    setCustomFields([...customFields, field])
  }

  function handleRemoveCustomField(index: number) {
    setCustomFields(customFields.filter((_, i) => i !== index))
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  const handleOnStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const startDate = event.target.value
    form.setValue('startDate', startDate)

    const selectedDate = new Date(startDate)
    const today = new Date(defaultStartDateStr)
    const rawEndDate = form.getValues('endDate')
    const endDate = new Date(rawEndDate)
    if (selectedDate > endDate) {
      toast({
        title: t('errorInDate'),
        duration: 2500
      })
    }

    if (selectedDate > today) {
      setMinStartTime('00:00')
    } else {
      const currentTime = new Date()
      const currentHours = currentTime.getHours().toString().padStart(2, '0')
      const currentMinutes = currentTime
        .getMinutes()
        .toString()
        .padStart(2, '0')
      setMinStartTime(`${currentHours}:${currentMinutes}`)

      // If the start date is today and the start time is less than the current time, set start time to ''
      const startTime = form.getValues('startTime')
      if (startTime && `${currentHours}:${currentMinutes}` > startTime) {
        form.setValue('startTime', '')
      }
    }

    setMinEndDate(startDate)
  }

  const handleOnStartTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.validity.valid) {
      const startTime = event.target.value
      form.setValue('startTime', startTime)
      setMinEndTime(startTime)
    } else {
      toast({
        title: t('errorInHours'),
        duration: 2500
      })
    }
  }

  const handleOnEndDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const endDate = event.target.value
    form.setValue('endDate', endDate)

    const startDate = form.getValues('startDate')

    if (new Date(endDate) < new Date(startDate)) {
      toast({
        title: t('errorInDate'),
        duration: 2500
      })
    }

    if (new Date(endDate) > new Date(startDate)) {
      setMinEndTime('00:00')
    } else {
      setMinEndTime(minStartTime)
    }
    const startTime = form.getValues('startTime')
    if (startTime) {
      const [hours, minutes] = startTime.split(':').map(Number)
      const endTime = new Date()
      endTime.setHours(hours)
      endTime.setMinutes(minutes + 10)
      const endHours = endTime.getHours().toString().padStart(2, '0')
      const endMinutes = endTime.getMinutes().toString().padStart(2, '0')
      if (new Date(endDate) <= new Date(startDate))
        setMinEndTime(`${endHours}:${endMinutes}`)
    }
  }

  const handleOnEndTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.validity.valid) {
      form.setValue('endTime', event.target.value)
    } else {
      toast({
        title: t('errorInHours'),
        duration: 2500
      })
    }
  }

  async function onSubmit(values: z.infer<typeof EventFormInputSchema>) {
    if (Object.keys(form.formState.errors).length > 0) {
      toast({
        title: t('errorInForm'),
        description: JSON.stringify(form.formState.errors),
        variant: 'destructive'
      })

      console.error(form.formState.errors)
    }

    if (!loading) {
      setLoading(true)
      try {
        let imageUrl = null
        if (selectedImage) {
          imageUrl = await UploadToS3(selectedImage)
        }

        const startDateTime = new Date(
          `${values.startDate}T${values.startTime}${extractGMTTime(values.timezoneLabel)}`
        )
        const endDateTime = new Date(
          `${values.endDate}T${values.endTime}${extractGMTTime(values.timezoneLabel)}`
        )

        const eventData: EventInputType = {
          ...values,
          ...locationDetails,
          ...(values.type === EventTypeEnum.IN_PERSON ? locationDetails : {}),
          startDate: startDateTime,
          endDate: endDateTime,
          openGraphImage: imageUrl || event?.openGraphImage,
          description,
          virtualLink:
            values.type === EventTypeEnum.ONLINE ? values.virtualLink : null
        }

        if (event) {
          await updateEvent(event.id, eventData, tickets)
          setSavedEventId(event.id)
          await updateCustomFields(event.id, customFields)
        } else {
          const result = await createEvent(organizationId, eventData, tickets)
          await updateCustomFields(result.id, customFields)
          setSavedEventId(result.id)
        }

        setShowSuccessDialog(true)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error(`${t('failedToSaveEvent')}`, error)
      }
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="mb-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="event-name"
                      placeholder={t('eventName')}
                      className="text-xl font-medium border rounded-lg px-4 py-2 w-full focus:ring focus:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[300px,1fr] gap-6">
            {/* Columna izquierda */}
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer hover:outline-gray-600"
                >
                  <div className="aspect-square bg-primary rounded-md mb-4 relative overflow-hidden flex items-center justify-center border border-gray-900">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Event preview"
                        fill
                        className="object-cover rounded-md"
                      />
                    ) : (
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center gap-3 cursor-pointer group"
                      >
                        <div className="bg-primary p-3 rounded-full group-hover:bg-primary-dark transition">
                          <UploadIcon className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-sm text-gray-600 group-hover:text-gray-800 transition">
                          {t('uploadImage')}
                        </span>
                        <span className="text-xs text-gray-400">
                          {t('allowedFormats')}: JPG, PNG, GIF
                        </span>
                      </label>
                    )}
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                  </div>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />
              </div>
              {/* Fecha y Hora */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {/* Fecha de inicio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      {t('start')}
                    </label>
                    <div className="flex space-x-2">
                      <Clock className="h-10 w-10 mb-2" />
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <Input
                            type="date"
                            className="w-full border rounded-lg px-3 py-2"
                            {...field}
                            min={defaultStartDateStr}
                            onChange={handleOnStartDateChange}
                          />
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <Input
                            type="time"
                            className="w-full border rounded-lg px-3 py-2"
                            {...field}
                            min={minStartTime}
                            onChange={handleOnStartTimeChange}
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Fecha de fin */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      {t('end')}
                    </label>
                    <div className="flex space-x-2">
                      <Clock className="h-10 w-10 mb-2" />
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <Input
                            type="date"
                            className="w-full border rounded-lg px-3 py-2"
                            {...field}
                            min={minEndDate}
                            onChange={handleOnEndDateChange}
                          />
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <Input
                            type="time"
                            className="w-full border rounded-lg px-3 py-2"
                            {...field}
                            min={minEndTime}
                            onChange={handleOnEndTimeChange}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="timezoneLabel"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        name="timezoneLabel"
                      >
                        <SelectTrigger className="w-full bg-transparent text-white">
                          <SelectValue
                            className="bg-transparent text-white"
                            placeholder={t('selectTimezone')}
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-none text-white">
                          {options.map((option, index) => (
                            <SelectItem
                              key={index}
                              className="focus:bg-accent/35 focus:text-[#61f1f8]"
                              value={option.label}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Elije el tipo de evento:
                </span>
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {field.value === EventTypeEnum.IN_PERSON
                          ? 'Presencial'
                          : 'Online'}
                      </span>
                      <Switch
                        checked={field.value === EventTypeEnum.ONLINE}
                        onCheckedChange={checked => {
                          field.onChange(
                            checked
                              ? EventTypeEnum.ONLINE
                              : EventTypeEnum.IN_PERSON
                          )
                          form.resetField('location')
                          form.resetField('virtualLink')
                        }}
                      />
                    </div>
                  )}
                />
              </div>

              {form.watch('type') === EventTypeEnum.IN_PERSON ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    {t('location')}
                  </label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <AddressAutocomplete
                          defaultValue={field.value ?? ''}
                          fieldName="location"
                          onSetAddress={field.onChange}
                          onAfterSelection={value => {
                            if (value?.address_components && value?.geometry) {
                              const locationDetails = getLocationDetails(
                                value.address_components
                              )
                              if (locationDetails) {
                                setLocationDetails({
                                  ...locationDetails,
                                  latLon: {
                                    lat: value.geometry?.location?.lat() ?? 0,
                                    lon: value.geometry?.location?.lng() ?? 0
                                  }
                                })
                              }
                            }
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="virtualLink"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-5 w-5" />
                        <FormControl>
                          <Input
                            placeholder="https://meet.example.com/your-event"
                            className="w-full"
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Descripción de tu evento:
              </label>
              <FormField
                control={form.control}
                name="description"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div className="max-h-96 overflow-y-auto border rounded p-2">
                        <MarkdownEditor
                          initialValue={description}
                          onChange={val => setDescription(val)}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-200">
                  Campos personalizados:
                </span>
                <Button
                  type="button"
                  onClick={() => setShowCustomFieldsDialog(true)}
                  variant="outline"
                  className="bg-secondary"
                >
                  Añade campos personalizados
                </Button>
              </div>

              {customFields.length > 0 && (
                <div className="space-y-2">
                  {customFields.map((field, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b py-2"
                    >
                      <div>
                        <span className="font-medium">{field.name}</span> -{' '}
                        <span className="text-sm text-gray-500">
                          {field.description}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleRemoveCustomField(index)}
                      >
                        Elimina el campo
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {t('capacity')}
                  </span>
                </div>
                <FormField
                  control={form.control}
                  name="maxAttendees"
                  render={({ field }) => (
                    <Input
                      type="number"
                      placeholder={t('unlimited')}
                      min={1}
                      className="w-32 text-right border rounded-lg px-3 py-2"
                      value={field.value?.toString()}
                      onChange={e => {
                        const value =
                          e.target.value === '' ? null : Number(e.target.value)
                        field.onChange(value)
                      }}
                    />
                  )}
                />
              </div>

              {/* Requires Approval */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {tPage('requiresApproval')}
                  </span>
                </div>
                <FormField
                  control={form.control}
                  name="requiresApproval"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowTicketManager(!showTicketManager)}
              >
                <span>{t('tickets')}</span>
                <span>{showTicketManager ? t('hide') : t('edit')}</span>
              </div>

              {tickets.length > 0 && !showTicketManager && (
                <div className="space-y-2">
                  {tickets.map((ticket, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 gap-4 border-b py-2"
                    >
                      <div>
                        <span>{ticket.name}</span>
                      </div>
                      <div className="text-center">
                        <span className="text-sm text-gray-500">
                          {ticket.price > 0 ? `S/${ticket.price}` : t('free')}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500">
                          {ticket.limit} {t('tickets')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showTicketManager && (
                <TicketTypesManager
                  tickets={tickets}
                  onUpdate={newTickets => {
                    setTickets(newTickets)
                    setShowTicketManager(false)
                  }}
                />
              )}

              {/* Submit */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full dark:bg-neutral-600 font-bold"
                >
                  {loading
                    ? event
                      ? `${t('updatingEvent')}`
                      : `${t('creatingEvent')}`
                    : event
                      ? `${t('updateEvent')}`
                      : `${t('createEvent')}`}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>

      <Dialog
        open={showSuccessDialog}
        onOpenChange={open => {
          setShowSuccessDialog(open)
          if (!open) {
            router.push(`/admin/organizations/${organizationId}/events`)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {event ? tPage('eventUpdated') : tPage('eventCreated')}
            </DialogTitle>
            <DialogDescription className="space-y-4">
              <p>
                {event
                  ? tPage('eventUpdatedDescription')
                  : tPage('eventCreatedDescription')}
              </p>
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSuccessDialog(false)
                    router.push(`/admin/organizations/${organizationId}/events`)
                  }}
                >
                  {tPage('goToEvents')}
                </Button>
                <Button asChild>
                  <Link href={`/${savedEventId}`}>{tPage('viewEvent')}</Link>
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <CustomFieldsDialog
        open={showCustomFieldsDialog}
        onOpenChange={setShowCustomFieldsDialog}
        onAddCustomField={handleAddCustomField}
      />
    </>
  )
}
