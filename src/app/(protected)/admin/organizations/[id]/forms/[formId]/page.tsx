import FormManager from '@/components/yiqiForm/FormManager'
import {
  getResultFormById,
  getFormById
} from '@/services/actions/typeForm/typeFormActions'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function FormPage({
  params
}: {
  params: { id: string; formId: string }
}) {
  const form = await getFormById(params.formId)

  if (!form.success) notFound()
  const formResult = await getResultFormById(params.formId)
  return (
    <div className="h-screen  dark:bg-[rgb(28, 28, 28)]">
      <FormManager
        formId={params.formId}
        orgId={params.id}
        formResponse={form.form || null}
        submissions={formResult.submissions || null}
      />
    </div>
  )
}
