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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  code: z
    .string()
    .min(1, { message: 'Código incorrecto' })
    .optional()

    .refine(val => val === undefined || val.toLowerCase() === 'andino vip', {
      message: 'Código incorrecto'
    }),

  amount: z.number().min(1, { message: 'Elije una cantidad de entradas' }),
  name: z.string().min(1, { message: 'Necesitamos tu nombre' }),
  phone: z.string().min(1, { message: '¿Cuál es tu teléfono?' }),
  email: z.string().email({ message: 'Tu email es inválido' }),
  linkedin: z.string().url({ message: 'Tu link es inválido' }),
  authorization: z.boolean().refine(val => val === true, {
    message: 'Debes autorizar el uso de tus datos'
  })
})

export function ContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      name: '',
      phone: '',
      email: '',
      linkedin: '',
      amount: 1,
      authorization: false
    }
  })

  const { toast } = useToast()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      /*    
       *here i need to add the new estandarized actions
       *
       *    await newLead({
        authorization: values.authorization,
        amount: values.amount,
        linkedin: values.linkedin,
        name: values.name,
        email: values.email,
        phone: values.phone,
      });
      const redirectUrl = await NewPayment({
        amount: values.amount,
        code: values.code,
      }); */
      window.location.href = '/error'
      toast({
        title:
          'Gracias por reservar tu entrada al Tech Grill Halloween Edition',
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
        className="space-y-4 backdrop-blur-lg border border-orange-500/30 bg-black bg-opacity-20 rounded-[22px] p-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-orange-300">Nombre</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Tu nombre"
                    {...field}
                    className="bg-black bg-opacity-50 border-orange-500/50 text-white"
                  />
                </FormControl>
                <FormDescription className="text-orange-200/70"></FormDescription>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-orange-300">Teléfono</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Tu número de teléfono"
                    {...field}
                    className="bg-black bg-opacity-50 border-orange-500/50 text-white"
                  />
                </FormControl>
                <FormDescription className="text-orange-200/70"></FormDescription>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-orange-300">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Tu email"
                  {...field}
                  className="bg-black bg-opacity-50 border-orange-500/50 text-white"
                />
              </FormControl>
              <FormDescription className="text-orange-200/70"></FormDescription>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="linkedin"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-orange-300">LinkedIn</FormLabel>
              <FormControl>
                <Input
                  placeholder="Tu perfil de LinkedIn"
                  {...field}
                  className="bg-black bg-opacity-50 border-orange-500/50 text-white"
                />
              </FormControl>
              <FormDescription className="text-orange-200/70"></FormDescription>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-orange-300">
                Cantidad de entradas
              </FormLabel>
              <Select
                onValueChange={value => field.onChange(parseInt(value, 10))}
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger className="bg-black bg-opacity-50 border-orange-500/50 text-white">
                    <SelectValue placeholder="Selecciona la cantidad" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'entrada' : 'entradas'} - {num * 65}{' '}
                      soles
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="text-orange-200/70"></FormDescription>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-orange-300">
                Tu codigo de descuento
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Codigo de descuento"
                  {...field}
                  className="bg-black bg-opacity-50 border-orange-500/50 text-white"
                />
              </FormControl>
              <FormDescription className="text-orange-200/70"></FormDescription>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="authorization"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-orange-500/30 p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-orange-300">
                  Autorización de uso de datos
                </FormLabel>
                <FormDescription className="text-orange-200/70">
                  Autorizo el uso de mis datos y fotos para videos y material
                  publicitario de andino
                </FormDescription>
              </div>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="min-w-full sm:w-1/2 bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 text-lg py-6"
        >
          Chapa tu entrada
        </Button>
      </form>
    </Form>
  )
}
