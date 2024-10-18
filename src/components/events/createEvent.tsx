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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

const EventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  color: z.string().optional(),
  location: z.string().optional(),
  virtualLink: z.string().url().optional(),
  maxAttendees: z.number().int().positive().optional()
})

function CreateEventForm() {
  const form = useForm<z.infer<typeof EventSchema>>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      color: '',
      location: '',
      virtualLink: '',
      maxAttendees: undefined
    }
  })

  function onSubmit(values: z.infer<typeof EventSchema>) {
    //createEvent()
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <FormDescription>¿Cuándo comienza tu evento?</FormDescription>
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
              <FormDescription>¿Cuándo termina tu evento?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
                        onChange={e => form.setValue('color', e.target.value)}
                        className="w-full h-10 rounded-md cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={field.value}
                        onChange={e => form.setValue('color', e.target.value)}
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
        <Button type="submit">Crea tu evento</Button>
      </form>
    </Form>
  )
}
function CreateEventButton() {
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <CreateEventForm />
      </DialogContent>
    </Dialog>
  )
}

export { CreateEventButton }
