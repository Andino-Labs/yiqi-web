'use server'

import prisma from '@/lib/prisma'
import { EventRegistrationSchema } from '@/schemas/eventSchema'
import { markRegistrationPaidMobile } from '@/services/actions/event/markRegistrationPaidMobile'

export async function checkExistingRegistrationMobile(
  eventId: string,
  email: string
) {
  try {
    const registration = await prisma.eventRegistration.findFirst({
      where: {
        eventId,
        user: {
          email: email.toLowerCase()
        }
      },
      include: {
        tickets: {
          include: {
            user: true,
            ticketType: true
          }
        },
        user: true,
        event: true
      }
    })

    // If the registration has a payment ID and is not paid, try to mark it as paid
    if (registration?.paymentId && !registration?.paid) {
      try {
        await markRegistrationPaidMobile(registration.id)
      } catch (e) {
        console.error(e)
      }
    }

    return registration ? EventRegistrationSchema.parse(registration) : null
  } catch (error) {
    console.error('Error checking registration:', error)
    return null
  }
}
