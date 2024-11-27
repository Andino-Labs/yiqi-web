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
import { Input } from '@/components/ui/input'
import { createEvent } from '@/services/actions/event/createEvent'
import {
  EventInputSchema,
  EventInputType,
  EventTicketInputType,
  EventTypeEnum,
  SavedEventType,
  SavedTicketType
} from '@/schemas/eventSchema'
import { useRouter } from 'next/navigation'
import { MapPin, Clock, Users, Pencil } from 'lucide-react'
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
import { defaultValue, MarkdownEditor } from './editor/mdEditor'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import Link from 'next/link'
import { translations } from '@/lib/translations/translations'

type Props = {
  organizationId: string
  event?: SavedEventType
  hasStripeAccount: boolean
}

export const EventFormInputSchema = EventInputSchema.extend({
  startTime: z.string(),
  endTime: z.string(),
  startDate: z.string(),
  endDate: z.string()
})

type LocationDetails = {
  city: string
  state: string
  country: string
}

const currentDate = new Date()
const localCurrentDate = new Date(
  currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
)
const defaultStartDateStr = localCurrentDate.toISOString().split('T')[0]
const defaultStartTimeStr = localCurrentDate
  .toISOString()
  .split('T')[1]
  .slice(0, 5)
const defaultEndDate = new Date(localCurrentDate.getTime() + 10 * 60 * 1000)
const defaultMinEndDateStr = defaultEndDate.toISOString().split('T')[0]
const defaultMinEndTimeStr = defaultEndDate
  .toISOString()
  .split('T')[1]
  .slice(0, 5)

export function EventForm({ organizationId, event, hasStripeAccount }: Props) {
  const router = useRouter()
  const [tickets, setTickets] = useState<
    EventTicketInputType[] | SavedTicketType[]
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
  console.log('EventxD:', event)

  const [loading, setLoading] = useState(false)
  const [showTicketManager, setShowTicketManager] = useState(false)
  const [showStripeDialog, setShowStripeDialog] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
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

  const [locationDetails, setLocationDetails] =
    useState<LocationDetails | null>(null)
  const form = useForm<z.infer<typeof EventFormInputSchema>>({
    resolver: zodResolver(EventFormInputSchema),
    defaultValues: {
      title: event?.title ?? '',
      startDate: event?.startDate.toISOString().split('T')[0] ?? '',
      startTime: event?.startDate.toISOString().split('T')[1].slice(0, 5) ?? '',
      endDate: event?.endDate.toISOString().split('T')[0] ?? '',
      endTime: event?.endDate.toISOString().split('T')[1].slice(0, 5) ?? '',
      location: event?.location ?? '',
      virtualLink: event?.virtualLink ?? '',
      description: event?.description ?? 'XYZMON',
      requiresApproval: event?.requiresApproval ?? false,
      openGraphImage: event?.openGraphImage ?? null,
      maxAttendees: event?.maxAttendees ?? undefined,
      type: event?.type ?? EventTypeEnum.IN_PERSON
    }
  })

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
    }
  }

  const handleOnEndDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const endDate = event.target.value
    form.setValue('endDate', endDate)

    const startDate = form.getValues('startDate')

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
      setMinEndTime(`${endHours}:${endMinutes}`)
    }
  }

  const handleOnEndTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.validity.valid) {
      form.setValue('endTime', event.target.value)
    }
  }

  async function onSubmit(values: z.infer<typeof EventFormInputSchema>) {
    if (!loading) {
      setLoading(true)
      try {
        let imageUrl = null
        if (selectedImage) {
          imageUrl = await UploadToS3(selectedImage)
        }

        const startDateTime = new Date(
          `${values.startDate}T${values.startTime}`
        )
        const endDateTime = new Date(`${values.endDate}T${values.endTime}`)

        const eventData: EventInputType = {
          ...values,
          ...locationDetails,
          startDate: startDateTime,
          endDate: endDateTime,
          openGraphImage: imageUrl, // Add the image URL to the payload
          description
        }

        if (event) {
          // Update existing event
          await updateEvent(event.id, eventData, tickets)
        } else {
          // Create new event
          await createEvent(organizationId, eventData, tickets)
        }

        router.push(`/admin/organizations/${organizationId}/events`)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error(translations.es.failedToSaveEvent, error)
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto md:max-w-5xl"
      >
        <div className="grid grid-cols-[300px,1fr] gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <label
                htmlFor="image-upload"
                className="cursor-pointer hover:outline-gray-600"
              >
                <div className="aspect-square bg-gray-100 rounded-md mb-2 relative overflow-hidden">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Event preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <span className="text-sm text-gray-500">
                        {translations.es.selectAnImage}
                      </span>
                    </div>
                  )}
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
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Event Name */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        id="event-name"
                        placeholder={translations.es.eventName}
                        className="text-xl border-0 px-0 focus-visible:ring-0"
                        {...field}
                      />
                      <label
                        htmlFor="event-name"
                        className="absolute top-2 right-2 cursor-pointer"
                      >
                        <Pencil />
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date and Time */}
            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 mt-2" />
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="mb-2">{translations.es.start}</div>
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                min={defaultStartDateStr}
                                onChange={handleOnStartDateChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="time"
                                {...field}
                                min={minStartTime}
                                onChange={handleOnStartTimeChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2">{translations.es.end}</div>
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                min={minEndDate}
                                onChange={handleOnEndDateChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="time"
                                {...field}
                                min={minEndTime}
                                onChange={handleOnEndTimeChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <Select defaultValue="GMT-05:00">
                  <SelectTrigger>
                    <SelectValue placeholder={translations.es.selectTimezone} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GMT-05:00">GMT-05:00 Lima</SelectItem>
                    {/* Add more timezones as needed */}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <AddressAutocomplete
                        defaultValue={field.value ?? ''}
                        fieldName="location"
                        onSetAddress={field.onChange}
                        onAfterSelection={value => {
                          if (value) {
                            setLocationDetails(
                              getLocationDetails(value.address_components)
                            )
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MarkdownEditor
                      initialValue={description}
                      name={field.name}
                      onChange={val => {
                        setDescription(val)
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{translations.es.capacity}</span>
              </div>
              <FormField
                control={form.control}
                name="maxAttendees"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={translations.es.unlimited}
                        min={1}
                        className="w-32 text-right"
                        value={field.value?.toString()}
                        onChange={e => {
                          const value =
                            e.target.value === ''
                              ? null
                              : Number(e.target.value)
                          field.onChange(value)
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Tickets */}
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => {
                if (hasStripeAccount) {
                  setShowTicketManager(!showTicketManager)
                } else {
                  setShowStripeDialog(true)
                }
              }}
            >
              <span>{translations.es.tickets}</span>
              <span>
                {showTicketManager
                  ? translations.es.hide
                  : translations.es.edit}
              </span>
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
                        {ticket.price > 0
                          ? `$${ticket.price}`
                          : translations.es.free}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">
                        {ticket.limit} {translations.es.tickets}
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

            {/* Stripe Account Dialog */}
            <Dialog open={showStripeDialog} onOpenChange={setShowStripeDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {translations.es.stripeAccountRequired}
                  </DialogTitle>
                  <DialogDescription>
                    {translations.es.stripeSetupInfo}
                    <Link
                      href={`/admin/organizations/${organizationId}/billing`}
                    >
                      {translations.es.clickHereStart}
                    </Link>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button onClick={() => setShowStripeDialog(false)}>
                    {translations.es.close}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Submit Button */}
            <div className="pt-4">
              <Button type="submit" className="w-full">
                {loading
                  ? event
                    ? translations.es.updatingEvent
                    : translations.es.creatingEvent
                  : event
                    ? translations.es.updateEvent
                    : translations.es.createEvent}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
