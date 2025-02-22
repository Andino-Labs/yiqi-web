import MainForm from '@/components/yiqiForm/MainForm'
import { getUserOrRedirect } from '@/lib/auth/getUserOrRedirect'
import { getOrganization } from '@/services/actions/organizationActions'
import React from 'react'

export default async function FormsPage({
  params
}: {
  params: { id: string }
}) {
  await getUserOrRedirect()

  const organization = await getOrganization(params.id)
  if (!organization) {
    return <div>Organization not found</div>
  }

  return (
    <div className="h-screen  dark:bg-[rgb(28, 28, 28)]">
      <MainForm orgId={params.id} />
    </div>
  )
}
