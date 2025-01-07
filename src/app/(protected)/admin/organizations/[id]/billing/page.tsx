import React from 'react'
import OrganizationLayout from '@/components/orgs/OrganizationLayout'
import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { getAdminOrganization } from '@/services/actions/organizationActions'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { BankAccountForm } from '@/components/billing/BankAccountForm'

export default async function OrganizationBillingPage({
  params
}: {
  params: { id: string }
}) {
  const organization = await getAdminOrganization(params.id)
  const user = await getUser()

  if (!user) {
    redirect(`/login`)
  }

  if (!organization) {
    redirect('/')
  }

  const billingInfo =
    organization.billingInfo && typeof organization.billingInfo === 'object'
      ? {
          accountName: String(
            (organization.billingInfo as Record<string, unknown>).accountName ||
              ''
          ),
          accountNumber: String(
            (organization.billingInfo as Record<string, unknown>)
              .accountNumber || ''
          ),
          country: String(
            (organization.billingInfo as Record<string, unknown>).country || ''
          )
        }
      : undefined

  return (
    <OrganizationLayout orgId={params.id} userProps={user}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Billing Information</CardTitle>
            <CardDescription>
              Add your bank account details to receive payouts. Payouts are
              processed once your balance reaches the minimum threshold.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BankAccountForm
              organizationId={params.id}
              initialData={billingInfo}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Purchase History</CardTitle>
            <CardDescription>
              Track your event sales and upcoming payouts.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground">
            Purchase history chart coming soon...
          </CardContent>
        </Card>
      </div>
    </OrganizationLayout>
  )
}
