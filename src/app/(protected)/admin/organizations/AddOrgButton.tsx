'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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
import { OrganizationSchema } from '@/services/organizationService'
import { useToast } from '@/hooks/use-toast'
import { Textarea } from '@/components/ui/textarea'

import { createOrganization } from '@/services/actions/organizationActions'

function ColorPicker({
  value,
  onChange
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-10 h-10 rounded-md cursor-pointer"
      />
      <Input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="#000000"
        className="w-24"
      />
    </div>
  )
}

const formSchema = OrganizationSchema

function AddOrgButtonForm({ userId }: { userId: { value: string } }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      logo: '',
      colour: '#000000' // Default color
    }
  })

  const { toast } = useToast()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createOrganization(values, userId.value)
      toast({
        description: 'Organización creada exitosamente!',
        variant: 'default'
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organización</FormLabel>
              <FormControl>
                <Input placeholder="Andino" {...field} />
              </FormControl>
              <FormDescription>
                Ingresa el nombre de tu organización principal
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
                  placeholder="Describe tu organización"
                  {...field}
                  className="resize-none"
                />
              </FormControl>
              <FormDescription>
                Proporciona una breve descripción de tu organización
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/logo.png" {...field} />
              </FormControl>
              <FormDescription>
                Ingresa la URL del logo de tu organización
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="colour"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <ColorPicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormDescription>
                Selecciona un color para tu organización
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit">
          Empezar
        </Button>
      </form>
    </Form>
  )
}

function AddOrgButton(userId: { value: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild className="w-fit">
        <Button className="min-w-fit">Crear nueva organización</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crea una nueva organización</DialogTitle>
          <DialogDescription>
            Llena los campos libres para continuar, luego podrás modificarlos!
          </DialogDescription>
        </DialogHeader>
        <AddOrgButtonForm userId={userId} />
      </DialogContent>
    </Dialog>
  )
}

export { AddOrgButton }
