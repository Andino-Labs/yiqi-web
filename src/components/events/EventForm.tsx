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
import { Switch } from '@/components/ui/switch'
import { createEvent } from '@/services/actions/event/createEvent'
import {
  EventInputSchema,
  EventInputType,
  EventTicketInputType,
  SavedEventType,
  SavedTicketType
} from '@/schemas/eventSchema'
import { useRouter } from 'next/navigation'
import { MapPin, Clock, Users } from 'lucide-react'
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

type Props = {
  organizationId: string
  event?: SavedEventType
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

export function EventForm({ organizationId, event }: Props) {
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

  const [showTicketManager, setShowTicketManager] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [locationDetails, setLocationDetails] =
    useState<LocationDetails | null>(null)
  const form = useForm<z.infer<typeof EventFormInputSchema>>({
    resolver: zodResolver(EventFormInputSchema),
    defaultValues: {
      title: event?.title ?? '',
      startDate: event?.startDate.toISOString() ?? '',
      startTime: event?.startDate.toISOString().split('T')[1] ?? '',
      endDate: event?.endDate.toISOString() ?? '',
      endTime: event?.endDate.toISOString().split('T')[1] ?? '',
      location: event?.location ?? '',
      virtualLink: event?.virtualLink ?? '',
      description: event?.description ?? '',
      requiresApproval: event?.requiresApproval ?? false,
      openGraphImage: event?.openGraphImage ?? null,
      maxAttendees: event?.maxAttendees ?? undefined
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

  async function onSubmit(values: z.infer<typeof EventFormInputSchema>) {
    try {
      let imageUrl = null
      if (selectedImage) {
        imageUrl = await UploadToS3(selectedImage)
      }

      const startDateTime = new Date(`${values.startDate}T${values.startTime}`)
      const endDateTime = new Date(`${values.endDate}T${values.endTime}`)

      const eventData: EventInputType = {
        ...values,
        ...locationDetails,
        startDate: startDateTime,
        endDate: endDateTime,
        openGraphImage: imageUrl // Add the image URL to the payload
      }

      if (event) {
        // Update existing event
        await updateEvent(event.id, eventData, tickets)
      } else {
        // Create new event
        await createEvent(organizationId, eventData, tickets)
      }

      router.push(`/admin/organizations/${organizationId}/events`)
    } catch (error) {
      console.error('Failed to save event:', error)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto"
      >
        <div className="grid grid-cols-[300px,1fr] gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <label htmlFor="image-upload">
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
                        Select an Image
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
                    <Input
                      placeholder="Event Name"
                      className="text-xl border-0 px-0 focus-visible:ring-0"
                      {...field}
                    />
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
                    <div className="mb-2">Start</div>
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="date" {...field} />
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
                              <Input type="time" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2">End</div>
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="date" {...field} />
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
                              <Input type="time" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <Select defaultValue="GMT-05:00">
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
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
                      initialValue={field.value}
                      name={field.name}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Event Options */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Event Options</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span>Require Approval</span>
                  </div>
                  <FormField
                    control={form.control}
                    name="requiresApproval"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span>Capacity</span>
                  </div>
                  <FormField
                    control={form.control}
                    name="maxAttendees"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Unlimited"
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
              </div>
            </div>

            {/* Tickets */}
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowTicketManager(true)}
            >
              <span>Tickets</span>
              <span className="text-blue-500">Free</span>
            </div>

            {showTicketManager && (
              <TicketTypesManager
                tickets={tickets}
                onUpdate={newTickets => {
                  setTickets(newTickets)
                  setShowTicketManager(false)
                }}
              />
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <Button type="submit" className="w-full">
                Create Event
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
