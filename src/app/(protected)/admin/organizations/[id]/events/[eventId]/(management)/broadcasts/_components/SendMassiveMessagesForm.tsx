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
import { Input } from '@/components/ui/input'
import type { AttendeeStatus } from '@prisma/client'
import { notifyAudience } from '../actions'
import { useParams } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useTranslationByGroup } from '@/hooks/commons'

enum ClientAttendeeStatus {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED'
}

const schema = z.object({
  audienceType: z.nativeEnum(ClientAttendeeStatus),
  subject: z.string().optional(),
  messageBody: z.string().min(10)
})
type SchemaType = z.infer<typeof schema>

export const SendMassiveMessagesForm = ({
  groupAudienceByStatus
}: {
  groupAudienceByStatus: {
    status: AttendeeStatus
    users: string[]
  }[]
}) => {
  const t = useTranslations('SendMassiveMessagesForm')
  const { toast } = useToast()
  const params = useParams<{ id: string }>()
  const [isFormVisible, setIsFormVisible] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    formState: { isValid }
  } = useForm<SchemaType>({
    mode: 'all',
    resolver: zodResolver(schema)
  })

  const onSubmit: SubmitHandler<SchemaType> = async data => {
    const userIds = groupAudienceByStatus.filter(
      _ => _.status === data.audienceType
    )[0].users
    await notifyAudience(params.id, userIds, data.messageBody, data.subject)
    toast({
      title: t('success'),
      description: t('emailsSent'),
      duration: 2000
    })
    setIsFormVisible(false)
  }

  const { getTranslation } = useTranslationByGroup('attendeeStatus')

  return (
    <div>
      <div>
        <Button
          type="button"
          onClick={() => {
            setIsFormVisible(true)
          }}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md transition-all"
        >
          <Send className="w-4 h-4" />
          {t('sendStatement')}
        </Button>
      </div>

      {isFormVisible && (
        <div className="mt-4 mx-auto max-w-[500px]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="max-w-[250px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                {t('recipients')}
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
                      <SelectValue placeholder={t('chooseAudience')} />
                    </SelectTrigger>
                    <SelectContent>
                      {groupAudienceByStatus.map((audienceType, index) => {
                        return (
                          <SelectItem key={index} value={audienceType.status}>
                            {getTranslation(audienceType.status.toString())} -{' '}
                            {audienceType.users.length} {t('registered')}
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
                {t('subject')}
              </label>
              <Input {...register('subject')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                {t('description')}
              </label>
              <Controller
                control={control}
                name="messageBody"
                render={({ field }) => (
                  <div className="max-h-[300px] overflow-y-auto">
                    <MarkdownEditor
                      initialValue={`<p>${t('defaultMessage')}</p>`}
                      onChange={value => field.onChange(value)}
                    />
                  </div>
                )}
              />
            </div>
            <div className="space-x-4 text-center">
              <Button
                type="submit"
                disabled={!isValid}
                variant="outline"
                className="font-bold text-white"
              >
                {t('send')}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="font-bold text-white"
                onClick={() => {
                  setIsFormVisible(false)
                }}
              >
                {t('close')}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
