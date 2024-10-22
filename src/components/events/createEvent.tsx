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

import {useState} from 'react'

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

  const [activeStep, setActiveStep] = useState<number>(0)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

      <div className="flex flex-col space-y-8">

        <div className="flex flex-col space-y-5">
          <div className="relative grid grid-cols-4 gap-3 before:absolute before:border-2 before:border-dashed before:top-3 before:left-0 before:right-0 before:w-[95%] before:border-[#b4b4b4] before:z-10 px-5">

          <div className={`${activeStep === 0 ? "bg-black text-white" : "bg-zinc-400 text-black"} rounded-md text-md z-50 w-8 flex justify-center items-center h-8`}>
            1
          </div>


          <div className={`${activeStep === 1 ? "bg-black text-white" : "bg-zinc-400 text-black"} rounded-md text-md z-50 w-8 flex justify-center items-center h-8`}>
            2
          </div>


          <div className={`${activeStep === 2 ? "bg-black text-white" : "bg-zinc-400 text-black"} rounded-md text-md z-50 w-8 flex justify-center items-center h-8`}>
            3
          </div>


          <div className={`${activeStep === 3 ? "bg-black text-white" : "bg-zinc-400 text-black"} rounded-md text-md z-50 w-8 flex justify-center items-center h-8`}>
            4
          </div>

          </div> 
          <p className="text-sm text-muted-foreground">
            After you are done with each step, click on the next button. 
            If you want to go back to a previous question, you can click the prev button
          </p>
        </div>

        {activeStep === 0 && (
          <div className="flex flex-col space-y-5">
            <div className="flex justify-center">
              {/* <h3 className="capitalize text-4xl font-bold">
                  step 1
              </h3> */}
            </div>

            <div className="flex items-start flex-col w-full  space-y-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-semibold">Título del Evento</FormLabel>
                    <FormControl>
                      <Input 
                      placeholder="Tech grill..." 
                      {...field} 
                      className="w-full"
                      />
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
                  <FormItem className="w-full">
                    <FormLabel className="font-semibold">Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe tu evento..."
                        className="resize-none w-full"
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
            </div>

          </div>
        )}

        {activeStep === 1 && (
          <div className="flex flex-col space-y-5">
            <div className="flex justify-center">
              {/* <h3 className="capitalize text-4xl font-bold">
                  step 2
              </h3> */}
            </div>

            <div className="flex items-start flex-col w-full  space-y-5">

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="w-full md:w-auto">
                    <FormLabel className="font-semibold">Fecha de Inicio</FormLabel>
                    <FormControl>
                      <Input 
                      type="datetime-local" 
                      {...field}
                      className="w-full"
                      />
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
                  <FormItem className="w-full md:w-auto">
                    <FormLabel className="font-semibold">Fecha de Finalización</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormDescription>¿Cuándo termina tu evento?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

          </div>
        )}

        {activeStep === 2 && (
          <div className="flex flex-col space-y-5">
            <div className="flex justify-center">
              {/* <h3 className="capitalize text-4xl font-bold">
                  step 3
              </h3> */}
            </div>

            <div className="flex items-start flex-col w-full  space-y-5">

              {/* color */}
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
                  <FormItem className="w-full">
                    <FormLabel className="font-semibold">Ubicación</FormLabel>
                    <FormControl>
                      <Input 
                      placeholder="Dirección del evento..." 
                      {...field}
                      className="w-full"
                      />
                    </FormControl>
                    <FormDescription>
                      ¿Dónde se llevará a cabo tu evento? (opcional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

          </div>
        )}

        {activeStep === 3 && (
          <div className="flex flex-col space-y-5">
            <div className="flex justify-center">
              {/* <h3 className="capitalize text-4xl font-bold">
                  step 4
              </h3> */}
            </div>

            <div className="flex items-start flex-col w-full  space-y-5">

             <FormField
                control={form.control}
                name="virtualLink"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-semibold">Enlace Virtual</FormLabel>
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
                  <FormItem className="w-full">
                    <FormLabel className="font-semibold">Máximo de Asistentes</FormLabel>
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
            </div>

          </div>
        )}


        <div className="flex space-x-5">
          {activeStep !== 0 && (
            <Button onClick={() => setActiveStep(activeStep - 1)} variant='secondary'>Prev</Button>
          )}

          {activeStep === 3 ? (
            <Button type="submit">Crea tu evento</Button>

          ) :(
            <Button onClick={() => setActiveStep(activeStep + 1)}>Next</Button>
          )}
        </div>

      </div>
      
      </form>
    </Form>
  )
}
function CreateEventButton() {
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <CreateEventForm />
      </DialogContent>
    </Dialog>
  )
}

export { CreateEventButton }
