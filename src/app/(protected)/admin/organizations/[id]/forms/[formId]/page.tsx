import FormManager from '@/components/yiqiForm/FormManager'
import { getUser } from '@/lib/auth/lucia'
import { getOrganization } from '@/services/actions/organizationActions'
import {
  getResultFormById,
  getFormById
} from '@/services/actions/typeForm/typeFormActions'
import { notFound, redirect } from 'next/navigation'
import React from 'react'

export default async function FormPage({
  params
}: {
  params: { id: string; formId: string }
}) {
  const user = await getUser()
  if (!user) {
    redirect('/auth')
  }

  const organization = await getOrganization(params.id)
  if (!organization) {
    return <div>Organization not found</div>
  }
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
