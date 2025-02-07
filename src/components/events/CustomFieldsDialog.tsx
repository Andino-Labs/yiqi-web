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
import { Textarea } from '@/components/ui/textarea'
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
      <DialogContent className="flex flex-col md:flex-row max-h-[90vh] overflow-hidden">
        <div className="w-full md:w-1/2 p-4 border-b md:border-b-0 md:border-r">
          <h3 className="font-semibold mb-2">Preview de JSON</h3>
          <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm">
            {JSON.stringify(jsonData, null, 2)}
          </pre>
        </div>
        <div className="w-full md:w-1/2 p-4 overflow-y-auto">
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
                render={function ({ field }) {
                  return (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nombre del campo"
                          {...field}
                          onBlur={function () {
                            updateJsonPreview(form.getValues())
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />

              <FormField
                control={form.control}
                name="description"
                render={function ({ field }) {
                  return (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Descripción del campo"
                          {...field}
                          onBlur={function () {
                            updateJsonPreview(form.getValues())
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={function ({ field }) {
                    return (
                      <FormItem>
                        <FormLabel>Tipo de Dato</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {['text', 'number', 'boolean', 'url'].map(
                              function (type) {
                                return (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                )
                              }
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />

                <FormField
                  control={form.control}
                  name="inputType"
                  render={function ({ field }) {
                    return (
                      <FormItem>
                        <FormLabel>Tipo de Entrada</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona entrada" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {['shortText', 'longText'].map(
                              function (inputType) {
                                return (
                                  <SelectItem key={inputType} value={inputType}>
                                    {inputType === 'shortText'
                                      ? 'Texto Corto'
                                      : 'Texto Largo'}
                                  </SelectItem>
                                )
                              }
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />
              </div>

              <FormField
                control={form.control}
                name="required"
                render={function ({ field }) {
                  return (
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
                  )
                }}
              />

              <FormField
                control={form.control}
                name="defaultValue"
                render={function ({ field }) {
                  const currentType = form.watch('type')
                  const currentInputType = form.watch('inputType')

                  if (currentType === 'boolean') {
                    return (
                      <FormItem>
                        <FormLabel>Valor por Defecto</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona valor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="true">Verdadero</SelectItem>
                            <SelectItem value="false">Falso</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )
                  }

                  if (currentInputType === 'longText') {
                    return (
                      <FormItem>
                        <FormLabel>Valor por Defecto</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Escribe el valor predeterminado"
                            className="min-h-[100px]"
                            {...field}
                            value={field.value?.toString() ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )
                  }

                  return (
                    <FormItem>
                      <FormLabel>Valor por Defecto</FormLabel>
                      <FormControl>
                        <Input
                          type={
                            currentType === 'number'
                              ? 'number'
                              : currentType === 'url'
                                ? 'url'
                                : 'text'
                          }
                          placeholder="Escribe el valor predeterminado"
                          {...field}
                          value={field.value?.toString() ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
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
