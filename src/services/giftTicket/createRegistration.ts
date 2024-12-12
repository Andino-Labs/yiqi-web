'use server'

import prisma from '@/lib/prisma'
import {
  AttendeeStatus,
  RegistrationInput,
  registrationInputSchema
} from '@/schemas/eventSchema'
import { LuciaUserType } from '@/schemas/userSchema'

export default async function giftTicket(
  contextUser: LuciaUserType | null,
  eventId: string,
  registrationData: RegistrationInput
) {
  try {
    // Validate input data
    const validatedData = registrationInputSchema.parse(registrationData)

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

    // registration created
    const user = contextUser

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

    if (!user) throw new Error('not an existing user user')

    const registration = await prisma.eventRegistration.create({
      data: {
        userId: user.id,
        eventId: event.id,
        status: 'APPROVED',
        customFields: validatedData,
        paid: true
      }
    })

    console.log('working on ticket')

    if (registration.status === AttendeeStatus.APPROVED) {
      const ticketCreations = Object.entries(validatedData.tickets).flatMap(
        ([ticketTypeId, quantity]) => {
          const ticketType = event.tickets.find(t => t.id === ticketTypeId)
          if (!ticketType)
            throw new Error(`Invalid ticket type ID: ${ticketTypeId}`)

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

      await prisma.ticket.createMany({
        data: ticketCreations
      })
    }

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
