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

export const SendMassiveMessagesForm = ({
  groupEmailsByStatus
}: {
  groupEmailsByStatus: {
    status: string
    emails: string[]
  }[]
}) => {
  const { control, handleSubmit } = useForm<{
    audienceType: string
  }>({
    mode: 'all'
  })

  const onSubmit: SubmitHandler<{
    audienceType: string
  }> = data => console.log(data)

  return (
    <div className="space-y-2">
      <div>Mensaje para tus audiencia:</div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="max-w-[250px]">
            <Controller
              control={control}
              name="audienceType"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Destinatarios" />
                  </SelectTrigger>
                  <SelectContent>
                    {groupEmailsByStatus.map((audienceType, index) => {
                      return (
                        <SelectItem key={index} value={audienceType.status}>
                          {audienceType.status} - {audienceType.emails.length}{' '}
                          registrados
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Button className="mx-auto flex items-center bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md transition-all">
              <Send className="w-4 h-4" />
              Enviar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
