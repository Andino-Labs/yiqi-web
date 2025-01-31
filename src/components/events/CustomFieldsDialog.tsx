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
import { CustomField, CustomFieldType } from '@/schemas/eventSchema'
import { useState } from 'react'

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
  const [jsonData, setJsonData] = useState<Record<string, string>>({
    name: 'nombre',
    email: 'correo@electronico.com'
  })

  const form = useForm<CustomFieldType>({
    resolver: zodResolver(CustomField),
    defaultValues: {
      name: '',
      description: '',
      type: 'text',
      inputType: 'shortText',
      required: false,
      defaultValue: undefined
    }
  })

  function onSubmit(data: CustomFieldType) {
    onAddCustomField(data)
    updateJsonPreview(data)
    form.reset()
    onOpenChange(false)
  }

  function updateJsonPreview(data: CustomFieldType) {
    if (data.name.trim()) {
      const description =
        data.description.length > 20
          ? `${data.description.substring(0, 20)}...`
          : data.description
      const newJsonData = { ...jsonData, [data.name]: description }
      setJsonData(newJsonData)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex">
        <div className="w-1/2 p-4 border-r">
          <pre>{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
        <div className="w-1/2 p-4">
          <DialogHeader>
            <DialogTitle>Añadir Campo Personalizado</DialogTitle>
            <DialogDescription>
              Añade un campo personalizado a tu evento. El nombre y la
              descripción son obligatorios.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nombre"
                        {...field}
                        onBlur={() => updateJsonPreview(form.getValues())}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Descripción"
                        {...field}
                        onBlur={() => updateJsonPreview(form.getValues())}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type Field */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['text', 'number', 'boolean', 'url'].map(type => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Input Type Field */}
              <FormField
                control={form.control}
                name="inputType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Entrada</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo de entrada" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['shortText', 'longText'].map(inputType => (
                          <SelectItem key={inputType} value={inputType}>
                            {inputType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Required Field */}
              <FormField
                control={form.control}
                name="required"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel>Obligatorio</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Default Value Field */}
              <FormField
                control={form.control}
                name="defaultValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor por Defecto</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Valor por Defecto"
                        {...field}
                        value={field.value?.toString() ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Añadir Campo
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
