import React from 'react'
import StripeConnect from '@/components/billing/StripeConnect'
import OrganizationLayout from '@/components/orgs/OrganizationLayout'
import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'

export default async function OrganizationBillingPage({
  params
}: {
  params: { id: string }
}) {
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }

  return (
    <OrganizationLayout orgId={params.id} userProps={user}>
      <StripeConnect accountId={params.id} />
    </OrganizationLayout>
  )
}
