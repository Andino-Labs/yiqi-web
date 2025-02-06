'use client'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { MarkdownEditor } from '@/components/events/editor/mdEditor'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

const schema = z.object({
  audienceType: z.string(),
  subject: z.string().optional(),
  messageBody: z.string().min(10, 'Ingresar mensaje')
})
type SchemaType = z.infer<typeof schema>

export const SendMassiveMessagesForm = ({
  groupEmailsByStatus
}: {
  groupEmailsByStatus: {
    status: string
    emails: string[]
  }[]
}) => {
  const {
    control,
    handleSubmit,
    formState: { isValid }
  } = useForm<SchemaType>({
    mode: 'all',
    resolver: zodResolver(schema)
  })

  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const onSubmit: SubmitHandler<SchemaType> = async data => {
    console.log(`data`, data)
  }

  return (
    <div>
      <div>
        <Button
          type="button"
          onClick={() => {
            setShowSuccessDialog(true)
          }}
          className="mx-auto flex items-center bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md transition-all"
        >
          <Send className="w-4 h-4" />
          Enviar comunicado
        </Button>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="md:max-w-[650px]">
          <DialogHeader>
            <DialogTitle className="mb-2">Enviar comunicado</DialogTitle>
            <DialogDescription>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="max-w-[250px]">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Destinatarios
                  </label>
                  <Controller
                    control={control}
                    name="audienceType"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Elije tu audiencia" />
                        </SelectTrigger>
                        <SelectContent>
                          {groupEmailsByStatus.map((audienceType, index) => {
                            return (
                              <SelectItem
                                key={index}
                                value={audienceType.status}
                              >
                                {audienceType.status} -{' '}
                                {audienceType.emails.length} registrados
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Asunto (opcional)
                  </label>
                  <Controller
                    control={control}
                    name="subject"
                    render={({ field }) => (
                      <Input {...field} placeholder="Nuevo asunto" />
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Descripción
                  </label>
                  <Controller
                    control={control}
                    name="messageBody"
                    render={({ field }) => (
                      <div className="max-h-[300px] overflow-y-auto">
                        <MarkdownEditor
                          initialValue={`<p>Tu mensaje</p>`}
                          onChange={value => field.onChange(value)}
                        />
                      </div>
                    )}
                  />
                </div>
                <div>
                  <Button
                    disabled={!isValid}
                    variant="outline"
                    className="font-bold text-white"
                  >
                    Enviar
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
