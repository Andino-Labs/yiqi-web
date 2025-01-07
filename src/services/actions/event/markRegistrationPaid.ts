'use server'

import prisma from '@/lib/prisma'
import { AttendeeStatus } from '@/schemas/eventSchema'
import { stripe } from '@/lib/stripe'

export async function markRegistrationPaid(registrationId: string) {
  try {
    // Get registration with payment info
    const registration = await prisma.eventRegistration.findUnique({
      where: { id: registrationId },
      include: {
        event: true
      }
    })

    if (!registration) {
      return { success: false, error: 'Registration not found' }
    }

    if (!registration.paymentId) {
      return { success: false, error: 'No payment ID found' }
    }

    // Verify payment status with Stripe
    const session = await stripe.checkout.sessions.retrieve(
      registration.paymentId
    )

    if (session.payment_status !== 'paid') {
      return {
        success: false,
        error: 'Payment has not been completed'
      }
    }

    // Update registration to paid
    await Promise.all([
      prisma.eventRegistration.update({
        where: { id: registrationId },
        data: {
          paid: true,
          status: AttendeeStatus.APPROVED
        }
      }),

      prisma.queueJob.create({
        data: {
          type: 'SEND_USER_MESSAGE',
          data: {
            userId: registration.userId,
            eventId: registration.eventId
          },
          notificationType: 'RESERVATION_CONFIRMED',
          userId: registration.userId,
          eventId: registration.eventId
        }
      })
    ])

    return { success: true }
  } catch (error) {
    console.error('Error marking registration as paid:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify payment'
    }
  }
}
