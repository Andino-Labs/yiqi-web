'use server'

import { stripe } from '@/lib/stripe'
import prisma from '@/lib/prisma'

export const createCheckoutSessionMobile = async (registrationId: string) => {
  const registration = await prisma.eventRegistration.findUniqueOrThrow({
    where: { id: registrationId },
    include: {
      tickets: { include: { ticketType: true } },
      event: true
    }
  })

  // If a Payment Intent already exists
  if (registration.paymentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        registration.paymentId
      )

      if (!paymentIntent.client_secret) {
        throw new Error('Payment Intent not found')
      }

      return {
        clientSecret: paymentIntent.client_secret
      }
    } catch (error) {
      console.error('Error retrieving Payment Intent', error)
      await prisma.eventRegistration.update({
        where: { id: registrationId },
        data: { paymentId: null }
      })

      throw new Error('Payment Intent not found')
    }
  }

  // Group tickets by ticket type and count quantities
  const ticketGroups = registration.tickets.reduce<Record<string, number>>(
    (acc, ticket) => {
      const id = ticket.ticketType.id
      acc[id] = (acc[id] || 0) + 1
      return acc
    },
    {}
  )

  const lineItems = Object.entries(ticketGroups).map(
    ([ticketTypeId, quantity]) => {
      const ticket = registration.tickets.find(
        t => t.ticketType.id === ticketTypeId
      )
      if (!ticket) throw new Error('Ticket not found')

      return {
        price_data: {
          currency: 'pen',
          product_data: {
            name: `${registration.event.title} - ${ticket.ticketType.name}`,
            description: `${ticket.ticketType.description} ${ticket.ticketType.category}`
          },
          unit_amount: ticket.ticketType.price.toNumber() * 100
        },
        quantity
      }
    }
  )

  const totalAmount = lineItems.reduce(
    (acc, item) => acc + item.price_data.unit_amount * item.quantity,
    0
  )

  // Create Payment Intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount,
    currency: 'pen',
    payment_method_types: ['card']
  })

  if (!paymentIntent.client_secret) {
    throw new Error('Payment Intent not created')
  }

  await prisma.eventRegistration.update({
    where: { id: registrationId },
    data: { paymentId: paymentIntent.id }
  })

  return {
    clientSecret: paymentIntent.client_secret
  }
}
