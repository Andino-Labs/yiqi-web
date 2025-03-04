import React from 'react'
import FormsList from '@/components/yiqiForm/FormResults/FormsList'
import { getForms } from '@/services/actions/typeForm/typeFormActions'

export default async function FormsPage({
  params
}: {
  params: { id: string }
}) {
  const formsResponse = await getForms(params.id)
  if (!formsResponse.success) {
    return (
      <div className="text-center text-gray-700 dark:text-gray-300">
        {formsResponse.error?.message ?? 'Formularios no encontrados'}
      </div>
    )
  }

  return (
    <main className="flex flex-col items-center justify-center">
      <FormsList organizationId={params.id} forms={formsResponse.forms || []} />
    </main>
  )
}
