'use client'

import { useToast } from '@/hooks/use-toast'
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
        if (result.data?.total === result.data?.successful) {
          toast({
            description: 'All contacts imported',
            variant: 'default'
          })
        } else if ((result.data?.successful ?? 0) > 0) {
          toast({
            description: 'Some contacts imported successfully',
            variant: 'default'
          })
        } else {
          toast({
            description: 'Failed to import contacts',
            variant: 'destructive'
          })
        }
        router.refresh()
      }
      setIsLoading(false)
    }
    input.click()
  }

  return (
    <button
      className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={handleImportContacts}
      disabled={isLoading}
    >
      {isLoading ? 'Importing...' : 'Import Contacts'}
    </button>
  )
}
