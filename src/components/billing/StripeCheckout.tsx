'use client'
import { useState, useEffect, useMemo } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js'
import { createCheckoutSession } from '@/services/actions/billing/createCheckoutSession'

export default function StripeCheckout({
  offerings
}: {
  offerings: { ticketOfferingId: string; amount: number }[]
}) {
  const [clientSecret, setClientSecret] = useState('')
  const [stripeAccountId, setStripeAccountId] = useState('')

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const { clientSecret, connectAccountId } =
          await createCheckoutSession(offerings)
        setClientSecret(clientSecret)
        setStripeAccountId(connectAccountId)
      } catch (error) {
        console.error('Error creating checkout session:', error)
      }
    }

    fetchClientSecret()
  }, [offerings])

  const stripePromise = useMemo(() => {
    if (!stripeAccountId) return null

    return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!, {
      stripeAccount: stripeAccountId
    })
  }, [stripeAccountId])

  function onComplete() {
    console.log('onComplete')
  }

  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{ clientSecret, onComplete }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  )
}
