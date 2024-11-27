'use server'

import { stripe } from '@/lib/stripe'

export const createAccountSession = async (accountId: string) => {
  const accountSession = await stripe.accountSessions.create({
    account: accountId,
    components: {
      account_onboarding: { enabled: true }
    }
  })

  return accountSession
}
