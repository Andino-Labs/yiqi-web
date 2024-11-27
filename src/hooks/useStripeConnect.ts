'use client'

import { useState, useEffect } from 'react'
import {
  loadConnectAndInitialize,
  StripeConnectInstance
} from '@stripe/connect-js'
import { createAccountSession } from '@/services/actions/billing/accountSessions'

export const useStripeConnect = (connectedAccountId: string) => {
  const [stripeConnectInstance, setStripeConnectInstance] =
    useState<StripeConnectInstance>()

  useEffect(() => {
    if (connectedAccountId) {
      const fetchClientSecret = async () => {
        const accountSession = await createAccountSession(connectedAccountId)
        return accountSession.client_secret
      }

      setStripeConnectInstance(
        loadConnectAndInitialize({
          publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
          fetchClientSecret,
          appearance: {
            overlays: 'dialog',
            variables: {
              colorPrimary: '#635BFF'
            }
          }
        })
      )
    }
  }, [connectedAccountId])

  return stripeConnectInstance
}

export default useStripeConnect
