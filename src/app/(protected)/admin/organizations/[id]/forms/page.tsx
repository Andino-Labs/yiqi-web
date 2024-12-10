import MainForm from '@/components/yiqiForm/MainForm'
import { getUser } from '@/lib/auth/lucia'
import { getOrganization } from '@/services/actions/organizationActions'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function FormsPage({
  params
}: {
  params: { id: string }
}) {
  const user = await getUser()

  const organization = await getOrganization(params.id)
  if (!organization) {
    return <div>Organization not found</div>
  }
  if (!user) {
    redirect('/auth')
  }

  return (
    <div className="h-screen  dark:bg-[rgb(28, 28, 28)]">
      <MainForm orgId={params.id} />
    </div>
  )
}
