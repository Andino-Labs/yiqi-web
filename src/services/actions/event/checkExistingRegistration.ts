'use server'

import prisma from '@/lib/prisma'
import { EventRegistrationSchema } from '@/schemas/eventSchema'
import { markRegistrationPaid } from './markRegistrationPaid'
import { getUser } from '@/lib/auth/lucia'
import { getRegistrationCookie } from '@/lib/utils/cookies'

export async function checkExistingRegistration(
  eventId: string,
  email?: string
) {
  const user = await getUser()
  const cookiedRegistration = getRegistrationCookie(eventId)

  if (!user && !cookiedRegistration) {
    console.debug('No user or cookie registration found')
    return null
  }

  try {
    // {
    //   eventId,
    //   user: {
    //     email: user?.email.toLowerCase()
    //   }
    // }
    const registration = await prisma.eventRegistration.findFirst({
      where:
        cookiedRegistration && !user
          ? { id: cookiedRegistration }
          : {
              eventId,
              user: {
                email: email?.toLocaleLowerCase() || user?.email.toLowerCase()
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
        await markRegistrationPaid(registration.id)
      } catch (e) {
        console.error(e)
      }
    }

    console.log(registration?.tickets)
    return registration ? EventRegistrationSchema.parse(registration) : null
  } catch (error) {
    console.error('Error checking registration:', error)
    return null
  }
}
