import OrganizationLayout from '@/components/orgs/OrganizationLayout'
import FormsList from '@/components/yiqiForm/FormResults/FormsList'
import { getUser } from '@/lib/auth/lucia'
import { getOrganization } from '@/services/actions/organizationActions'
import { getForms } from '@/services/actions/typeForm/typeFormActions'
import { redirect } from 'next/navigation'
import React from 'react'
export default async function FormsPage({
  params
}: {
  params: { id: string }
}) {
  const user = await getUser()
  if (!user) {
    redirect('/auth')
  }

  const organization = await getOrganization(params.id)
  if (!organization) {
    return <div>Organization not found</div>
  }
  const formsResponse = await getForms(organization.id)
  if (!formsResponse.success) {
    return (
      <div className="text-center text-gray-700 dark:text-gray-300">
        {formsResponse.error?.message ?? 'Formularios no encontrados'}
      </div>
    )
  }

  return (
    <main className="flex flex-col items-center justify-center">
      <OrganizationLayout
        orgId={params.id}
        userProps={{
          id: user.id,
          name: user.name,
          email: user.email,
          picture: user.picture ?? ''
        }}
      >
        <FormsList
          organizationId={organization.id}
          forms={formsResponse.forms || []}
        />
      </OrganizationLayout>
    </main>
  )
}
