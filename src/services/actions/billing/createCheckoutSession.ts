'use server'

import { stripe } from '@/lib/stripe'
import prisma from '@/lib/prisma'

export const createCheckoutSession = async (registrationId: string) => {
  const registration = await prisma.eventRegistration.findUniqueOrThrow({
    where: { id: registrationId },
    include: {
      tickets: { include: { ticketType: true } },
      event: true
    }
  })

  if (registration.paymentId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(
        registration.paymentId
      )

      if (!session.client_secret) {
        throw new Error('Checkout session not found')
      }

      return {
        clientSecret: session.client_secret
      }
    } catch (error) {
      console.error('Error retrieving checkout session', error)
      // clear out this invalid session and try to make a new one
      await prisma.eventRegistration.update({
        where: { id: registrationId },
        data: { paymentId: null }
      })

      throw new Error('Checkout session not found')
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

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    redirect_on_completion: 'never',
    mode: 'payment',
    ui_mode: 'embedded'
  })

  if (!session.client_secret) {
    throw new Error('Checkout session not created')
  }

  await prisma.eventRegistration.update({
    where: { id: registrationId },
    data: { paymentId: session.id }
  })

  return {
    clientSecret: session.client_secret
  }
}
