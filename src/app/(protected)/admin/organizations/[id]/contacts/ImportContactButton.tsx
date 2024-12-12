'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { importUsersAction } from '@/services/actions/importActions'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function ImportContactButton(params: { organizationId: string }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations('DeleteAccount')

  const handleImportContacts = async () => {
    setIsLoading(true)
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv'
    input.onchange = async event => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('orgId', params.organizationId)
        const result = await importUsersAction(formData)
        if (!result.success || result.errors?.length > 0) {
          showErrorsToast(result.errors)
        } else {
          showSuccessToast()
        }
        router.refresh()
      }
      setIsLoading(false)
    }
    input.oncancel = () => setIsLoading(false)
    input.click()
  }

  const showErrorsToast = (errors: { message: string }[]) => {
    const errorMessages = errors.reduce(
      (acc: string, error: { message: string }, index: number) => {
        return acc + error.message + (index < errors.length - 1 ? '<br />' : '')
      },
      ''
    )
    toast({
      title: 'ERROR:',
      description: <span dangerouslySetInnerHTML={{ __html: errorMessages }} />,
      variant: 'default'
    })
  }

  const showSuccessToast = () => {
    toast({
      title: 'SUCCESS:',
      description: 'Contacts imported successfully',
      variant: 'default'
    })
  }

  return (
    <Button
      className="w-70% dark:bg-neutral-600 font-bold"
      onClick={handleImportContacts}
      disabled={isLoading}
    >
      {isLoading ? `${t('importing')}` : `${t('importContacts')}`}
    </Button>
  )
}
