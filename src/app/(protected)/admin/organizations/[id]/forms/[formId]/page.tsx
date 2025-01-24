import FormManager from '@/components/yiqiForm/FormManager'
import { getUser } from '@/lib/auth/lucia'
import { getOrganization } from '@/services/actions/organizationActions'
import {
  getResultFormById,
  getFormById
} from '@/services/actions/typeForm/typeFormActions'
import { AlertCircle } from 'lucide-react'
import { redirect } from 'next/navigation'
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

  if (!form.success) {
    return (
      <div className="h-screen dark:bg-[rgb(28, 28, 28)] w-full flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500" />

          <h1 className="text-3xl font-bold dark:text-white">
            El archivo que solicitaste no existe.
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400">
            Asegúrate de que tienes la dirección URL correcta y de que el
            archivo existe.
          </p>
        </div>
      </div>
    )
  }
  const formResult = await getResultFormById(params.formId)
  console.log(formResult)
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
