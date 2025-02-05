import FormManager from '@/components/yiqiForm/FormManager'
import { getUser } from '@/lib/auth/lucia'
import { getOrganization } from '@/services/actions/organizationActions'
import { redirect } from 'next/navigation'
import React from 'react'

async function page({ params }: { params: { id: string } }) {
  const user = await getUser()
  if (!user) {
    redirect('/auth')
  }

  const organization = await getOrganization(params.id)
  if (!organization) {
    return <div>Organization not found</div>
  }
  return (
    <FormManager orgId={params.id} formResponse={null} submissions={null} />
  )
}

export default page
