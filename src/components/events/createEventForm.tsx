'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Paintbrush } from 'lucide-react'
import { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../ui/accordion'
import { TicketTypesManager } from './TicketTypesManager'
import { createEvent } from '@/services/actions/eventActions'
import { useParams } from 'next/navigation'
import { EventInputSchema, EventTicketInputType } from '@/schemas/eventSchema'
import { useRouter } from 'next/navigation'

function CreateEventForm() {
  const params = useParams()
  const router = useRouter()
  const form = useForm<z.infer<typeof EventInputSchema>>({
    resolver: zodResolver(EventInputSchema),
    defaultValues: {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      color: '',
      location: '',
      virtualLink: '',
      maxAttendees: undefined,
      tickets: []
    }
  })

  const [tickets, setTickets] = useState<EventTicketInputType[]>([])

  async function onSubmit(values: z.infer<typeof EventInputSchema>) {
    try {
      const finalValues = {
        ...values,
        tickets
      }

      await createEvent(params.id as string, finalValues)
      router.push(`/admin/organizations/${params.id}/events`)
    } catch (error) {
      console.error('Failed to create event:', error)
      // Show error message to user
    }
  }

  const [openSections, setOpenSections] = useState<string>('informacion-basica')

  const handleAccordionChange = (value: string) => {
    setOpenSections(value)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex justify-between items-center mb-6">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          <Button type="submit">Create Event</Button>
        </div>

        <Accordion
          type="single"
          value={openSections}
          onValueChange={handleAccordionChange}
        >
          <AccordionItem value="informacion-basica">
            <AccordionTrigger className="bg-gray-300 px-2">
              Información Básica
            </AccordionTrigger>
            <AccordionContent>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título del Evento</FormLabel>
                    <FormControl>
                      <Input placeholder="Tech grill..." {...field} />
                    </FormControl>
                    <FormDescription>
                      ¿Cuál es el nombre de tu evento?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe tu evento..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Proporciona una breve descripción de tu evento (opcional).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Inicio</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormDescription>
                      ¿Cuándo comienza tu evento?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Finalización</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormDescription>
                      ¿Cuándo termina tu evento?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ubicación</FormLabel>
                    <FormControl>
                      <Input placeholder="Dirección del evento..." {...field} />
                    </FormControl>
                    <FormDescription>
                      ¿Dónde se llevará a cabo tu evento? (opcional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="virtualLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enlace Virtual</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Si es un evento virtual, proporciona el enlace (opcional).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="configuraciones">
            <AccordionTrigger className="bg-gray-300 px-2">
              Configuraciones
            </AccordionTrigger>
            <AccordionContent>
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Color</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'w-[200px] justify-between',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              <>
                                <span
                                  className="h-4 w-4 rounded-full mr-2"
                                  style={{ backgroundColor: field.value }}
                                />
                                {field.value}
                              </>
                            ) : (
                              'Selecciona un color'
                            )}
                            <Paintbrush className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[280px] p-3">
                        <div className="flex flex-col space-y-3">
                          <div className="flex flex-col space-y-2">
                            <label
                              htmlFor="color-picker"
                              className="text-sm font-medium"
                            >
                              Selecciona un color
                            </label>
                            <input
                              id="color-picker"
                              type="color"
                              value={field.value}
                              onChange={e =>
                                form.setValue('color', e.target.value)
                              }
                              className="w-full h-10 rounded-md cursor-pointer"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Input
                              value={field.value}
                              onChange={e =>
                                form.setValue('color', e.target.value)
                              }
                              placeholder="#000000"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="px-3"
                              onClick={() => form.setValue('color', '')}
                            >
                              Resetear
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Elige un color para tu evento (opcional).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxAttendees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Máximo de Asistentes</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={e => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormDescription>
                      Número máximo de asistentes permitidos (opcional).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="informacion-tickets">
            <AccordionTrigger className="bg-gray-300 px-2">
              Información de Tickets
            </AccordionTrigger>
            <AccordionContent>
              <TicketTypesManager
                tickets={tickets}
                onUpdate={newTickets => setTickets(newTickets)}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </Form>
  )
}

export { CreateEventForm }