'use server'

import { stripe } from '@/lib/stripe'
import prisma from '@/lib/prisma'

type Props = {
  ticketOfferingId: string
  amount: number
}

export const createCheckoutSession = async (offerings: Props[]) => {
  if (offerings.length === 0) {
    throw new Error('No offerings provided')
  }

  let stripeAccountId: string = ''

  const lineItems = await Promise.all(
    offerings.map(async ({ ticketOfferingId, amount }) => {
      const ticketOffering = await prisma.ticketOfferings.findUnique({
        where: { id: ticketOfferingId },
        include: {
          event: {
            include: {
              organization: true
            }
          }
        }
      })

      if (!ticketOffering) {
        throw new Error('Ticket offering not found')
      }

      if (!ticketOffering.event.organization.stripeAccountId) {
        throw new Error('Organization does not have a stripe account')
      }

      stripeAccountId = ticketOffering.event.organization.stripeAccountId

      return {
        price_data: {
          currency: 'pen',
          product_data: {
            name: `${ticketOffering.event.title} - ${ticketOffering.name}`,
            description: ticketOffering.description ?? undefined
          },
          unit_amount: ticketOffering.price.toNumber() * 100
        },
        quantity: amount
      }
    })
  )

  const line_items = await Promise.all(lineItems)

  const commission = 0.05

  const application_fee_amount =
    line_items.reduce((acc, item) => {
      return acc + item.price_data.unit_amount * item.quantity
    }, 0) * commission

  const session = await stripe.checkout.sessions.create(
    {
      line_items,
      payment_intent_data: {
        application_fee_amount: Math.round(application_fee_amount)
      },
      mode: 'payment',
      ui_mode: 'embedded',
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/checkout/return?session_id={CHECKOUT_SESSION_ID}`
    },
    {
      stripeAccount: stripeAccountId
    }
  )
  if (!session.client_secret) {
    throw new Error('Checkout session not created')
  }

  return {
    clientSecret: session.client_secret,
    connectAccountId: stripeAccountId
  }
}
