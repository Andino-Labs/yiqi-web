'use server'

import prisma from '@/lib/prisma'
import { AttendeeStatus } from '@/schemas/eventSchema'
import { stripe } from '@/lib/stripe'

export async function markRegistrationPaidMobile(registrationId: string) {
  try {
    // Get registration with payment info
    const registration = await prisma.eventRegistration.findUnique({
      where: { id: registrationId },
      include: {
        event: {
          include: {
            organization: true
          }
        }
      }
    })

    if (!registration) {
      return { success: false, error: 'Registration not found' }
    }

    if (!registration.paymentId) {
      return { success: false, error: 'No payment ID found' }
    }

    if (!registration.event.organization.stripeAccountId) {
      return { success: false, error: 'No stripe account ID found' }
    }

    // Verify payment status with Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.retrieve(
      registration.paymentId,
      { expand: ['charges'] }, // Include charges to check for payment status
      { stripeAccount: registration.event.organization.stripeAccountId }
    )

    if (paymentIntent.status !== 'succeeded') {
      return {
        success: false,
        error: 'Payment has not been completed'
      }
    }

    // Update registration to paid
    await prisma.eventRegistration.update({
      where: { id: registrationId },
      data: {
        paid: true,
        status: AttendeeStatus.APPROVED
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Error marking registration as paid:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify payment'
    }
  }
}
