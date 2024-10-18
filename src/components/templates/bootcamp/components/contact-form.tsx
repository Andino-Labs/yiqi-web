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
import { useToast } from '@/hooks/use-toast'

// Define the Zod schema
const formSchema = z.object({
  name: z.string().min(1, { message: 'Necesitamos tu nombre' }),
  phone: z.string().min(1, { message: '¿Cuál es tu teléfono?' }),
  email: z.string().email({ message: 'Tu email es inválido' }),
  linkedin: z.string().url({ message: 'Tu link es inválido' })
})

export function ContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      linkedin: ''
    }
  })

  const { toast } = useToast()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // get to add the server action to create the lead based on org id
      toast({
        title: 'Gracias por postular al bootcamp',
        description: `${values}`
      })
    } catch (error) {
      toast({
        description: `${error}`,
        variant: 'destructive'
      })
    } finally {
      await form.reset()
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="backdrop-blur-lg border bg-black rounded-[22px] bg-opacity-20 p-4"
      >
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Tu nombre" {...field} />
              </FormControl>
              <FormDescription className="text-white">
                Introduce tu nombre completo.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Field */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input placeholder="Tu número de teléfono" {...field} />
              </FormControl>
              <FormDescription className="text-white">
                Introduce tu número de teléfono.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Tu email" {...field} />
              </FormControl>
              <FormDescription className="text-white">
                Utilizaremos este email para contactarte.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* LinkedIn Field */}
        <FormField
          control={form.control}
          name="linkedin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn</FormLabel>
              <FormControl>
                <Input placeholder="Tu perfil de LinkedIn" {...field} />
              </FormControl>
              <FormDescription className="text-white">
                Proporciona la URL de tu perfil de LinkedIn.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button variant={'secondary'} className="w-full mt-2" type="submit">
          Postular al bootcamp
        </Button>
      </form>
    </Form>
  )
}
