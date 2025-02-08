import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { CustomField, type CustomFieldType } from '@/schemas/eventSchema'

type CustomFieldsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddCustomField: (field: CustomFieldType) => void
}

export function CustomFieldsDialog({
  open,
  onOpenChange,
  onAddCustomField
}: CustomFieldsDialogProps) {
  const form = useForm<CustomFieldType>({
    resolver: zodResolver(CustomField),
    defaultValues: {
      name: '',
      description: '',
      type: 'text',
      inputType: 'shortText',
      required: false
    }
  })

  function onSubmit(data: CustomFieldType) {
    onAddCustomField(data)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden">
        <div className="p-4 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Añadir Campo Personalizado</DialogTitle>
            <DialogDescription>
              Añade un campo personalizado a tu evento. El nombre y la
              descripción son obligatorios.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Campo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Teléfono de contacto"
                        {...field}
                      />
                    </FormControl>
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
                      <Input
                        placeholder="Ej: Número de teléfono para contactar en caso de emergencia"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Dato</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tipo de dato" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {['text', 'number', 'url'].map(type => {
                            let label = ''
                            switch (type) {
                              case 'text':
                                label = 'Texto'
                                break
                              case 'number':
                                label = 'Número'
                                break
                              case 'url':
                                label = 'Enlace web'
                                break
                            }
                            return (
                              <SelectItem key={type} value={type}>
                                {label}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="inputType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Entrada</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tipo de entrada" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {['shortText', 'longText'].map(inputType => (
                            <SelectItem key={inputType} value={inputType}>
                              {inputType === 'shortText'
                                ? 'Texto Corto'
                                : 'Texto Largo'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="required"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <FormLabel>Campo Obligatorio</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Los usuarios deben completar este campo
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button variant={'outline'} type="submit" className="w-full">
                Crear Campo Personalizado
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
