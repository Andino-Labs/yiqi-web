'use server'

import { stripe } from '@/lib/stripe'
import prisma from '@/lib/prisma'

export const createConnectAccount = async (organizationId: string) => {
  const account = await stripe.accounts.create({
    controller: {
      stripe_dashboard: {
        type: 'express'
      },
      fees: {
        payer: 'application'
      },
      losses: {
        payments: 'application'
      }
    }
  })

  // Save the account ID in your database
  await prisma.organization.update({
    where: { id: organizationId },
    data: { stripeAccountId: account.id }
  })

  return account
}
