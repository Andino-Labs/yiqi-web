'use client'

import { useToast } from '@/hooks/use-toast'
import { translations } from '@/lib/translations/translations'
import { importUsersAction } from '@/services/actions/importActions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function ImportContactButton(params: { organizationId: string }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

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
    <button
      className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={handleImportContacts}
      disabled={isLoading}
    >
      {isLoading ? translations.es.importing : translations.es.importContacts}
    </button>
  )
}
