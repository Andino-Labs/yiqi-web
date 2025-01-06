'use server'

import {
  AttendeeStatus,
  RegistrationInput,
  registrationInputSchema
} from '@/schemas/eventSchema'
import prisma from '../prisma'
import setupInitialEventNotifications from '@/services/notifications/setupInitialNotifications'
import { LuciaUserType } from '@/schemas/userSchema'
import { setRegistrationCookie } from '../utils/cookies'

export async function createRegistration(
  contextUser: LuciaUserType | null,
  eventId: string,
  registrationData: RegistrationInput
) {
  try {
    // Validate input data
    const validatedData = registrationInputSchema.parse(registrationData)

    // Get event and its tickets
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        tickets: {
          include: {
            Ticket: true
          }
        },
        registrations: {
          include: {
            tickets: true
          }
        }
      }
    })

    if (!event) throw new Error('Event not found')

    // Validate tickets exist and respect limits
    const ticketValidations = await Promise.all(
      Object.entries(validatedData.tickets).map(
        async ([ticketId, quantity]) => {
          const ticketType = event.tickets.find(t => t.id === ticketId)
          if (!ticketType) throw new Error(`Invalid ticket ID: ${ticketId}`)

          // Check if adding these tickets would exceed the ticket limit
          if (quantity > ticketType.limit) {
            throw new Error(`Ticket ${ticketType.name} exceeds available limit`)
          }

          // Count existing tickets of this type
          const existingTicketsCount = event.registrations.reduce(
            (count, reg) => {
              return (
                count +
                reg.tickets.filter(t => t.ticketTypeId === ticketId).length
              )
            },
            0
          )

          // Check if adding these tickets would exceed limit
          if (existingTicketsCount + quantity > ticketType.limit) {
            throw new Error(
              `Ticket ${ticketType.name} has insufficient availability`
            )
          }

          return true
        }
      )
    )

    if (ticketValidations.some(validation => validation !== true)) {
      throw new Error('Ticket validation failed')
    }

    // Get or create user
    let user = contextUser
      ? contextUser
      : await prisma.user.findUnique({
          where: { email: validatedData.email.toLocaleLowerCase() }
        })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: validatedData.email.toLocaleLowerCase(),
          name: validatedData.name
        }
      })
    }

    // Create registration
    const registration = await prisma.eventRegistration.create({
      data: {
        userId: user.id,
        eventId: event.id,
        status: event.requiresApproval ? 'PENDING' : 'APPROVED',
        customFields: validatedData,
        paid: false // Set to true when implementing payments
      }
    })

    await setRegistrationCookie(eventId, registration.id)

    // if ticket requires payment we need to ensure we dont send them a message
    let ticketsRequirePayment = false

    // If registration is approved (no approval required), create tickets
    if (registration.status === AttendeeStatus.APPROVED) {
      const ticketCreations = Object.entries(validatedData.tickets).flatMap(
        ([ticketTypeId, quantity]) => {
          const ticketType = event.tickets.find(t => t.id === ticketTypeId)
          if (!ticketType)
            throw new Error(`Invalid ticket type ID: ${ticketTypeId}`)

          if (ticketType.price.toNumber() > 0) {
            ticketsRequirePayment = true
          }

          return Array(quantity)
            .fill(null)
            .map(() => ({
              registrationId: registration.id,
              userId: user.id,
              category: ticketType.category,
              ticketTypeId: ticketType.id
            }))
        }
      )

      await Promise.all([
        prisma.ticket.createMany({
          data: ticketCreations
        }),
        // send them their tickets
        ticketsRequirePayment
          ? null
          : prisma.queueJob.create({
              data: {
                type: 'SEND_USER_MESSAGE',
                data: {
                  userId: user.id,
                  eventId: event.id
                },
                notificationType: 'RESERVATION_CONFIRMED',
                userId: user.id,
                eventId: event.id
              }
            })
      ])
    }

    // Setup notifications
    await setupInitialEventNotifications({
      userId: user.id,
      orgId: event.organizationId
    })

    return {
      success: true,
      registration,
      message: event.requiresApproval
        ? 'Registration pending approval'
        : 'Registration successful'
    }
  } catch (error) {
    console.error('Error in createRegistration:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to create registration' }
  }
}
