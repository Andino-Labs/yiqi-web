'use client'

import { Button } from '../ui/button'
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
import { createOrganization } from '@/services/actions/organizationActions'
import { OrganizationSchema } from '@/services/organizationService'
import { useToast } from '@/hooks/use-toast'
import { Textarea } from '../ui/textarea'
import { makeRegularUser } from '@/services/actions/userActions'
import { SingleFileUpload } from '../upload/upload'

function BeRegularUserButton({ userId }: { userId: { value: string } }) {
  const { toast } = useToast()
  return (
    <Button
      className="min-w-full"
      onClick={async () => {
        await makeRegularUser({ userId: userId.value })
        toast({
          description: 'Bienvenido nuevo usuario!',
          variant: 'default'
        })
      }}
    >
      Asisto a los eventos!
    </Button>
  )
}

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

const formSchema = OrganizationSchema.extend({
  logo: z.string().url().optional()
})

export default function BeEventAdminForm({
  userId
}: {
  userId: { value: string }
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      logo: '',
      colour: '#000000'
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
      form.reset()
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
        <FormLabel>Logo</FormLabel>
        <FormControl>
          <SingleFileUpload
            onUploadComplete={url => form.setValue('logo', url)}
          />
        </FormControl>
        <FormDescription>Sube el logo de tu organización</FormDescription>

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
function BeEventAdmin(userId: { value: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild className="w-full">
        <Button className="min-w-full">Quiero manejar mi comunidad!</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crea tu manejador de comunidades</DialogTitle>
          <DialogDescription>
            Llena los campos libres para continuar, luego podrás modificarlos!
          </DialogDescription>
        </DialogHeader>
        <BeEventAdminForm userId={userId} />
      </DialogContent>
    </Dialog>
  )
}

export { BeRegularUserButton, BeEventAdmin }
