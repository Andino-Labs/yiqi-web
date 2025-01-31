'use server'

import {
  RegistrationInput,
  AttendeeStatus,
  registrationInputSchema,
  CustomFieldsSchema
} from '@/schemas/eventSchema'
import prisma from '../prisma'
import setupInitialEventNotifications from '@/services/notifications/setupInitialNotifications'
import { LuciaUserType } from '@/schemas/userSchema'
import { setRegistrationCookie } from '../utils/cookies'

type CustomFieldsSchemaType = typeof CustomFieldsSchema._type

export async function createRegistration(
  contextUser: LuciaUserType | null,
  eventId: string,
  registrationData: RegistrationInput
) {
  try {
    const validatedData = registrationInputSchema.parse(registrationData)

    // Get event with all necessary relations
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

    // Validate tickets
    const ticketValidationResults = await Promise.all(
      Object.entries(validatedData.tickets).map(
        async ([ticketId, quantity]) => {
          const ticketType = event.tickets.find(t => t.id === ticketId)
          if (!ticketType) throw new Error(`Invalid ticket ID: ${ticketId}`)

          const existingCount = event.registrations.reduce(
            (count: number, reg) =>
              count +
              reg.tickets.filter(t => t.ticketTypeId === ticketId).length,
            0
          )

          if (existingCount + quantity > ticketType.limit) {
            throw new Error(
              `Ticket ${ticketType.name} has insufficient availability`
            )
          }

          return true
        }
      )
    )

    if (ticketValidationResults.some(result => result !== true)) {
      throw new Error('Ticket validation failed')
    }

    // User handling
    const user =
      contextUser ??
      (await prisma.user.findUnique({
        where: { email: validatedData.email.toLowerCase() }
      })) ??
      (await prisma.user.create({
        data: {
          email: validatedData.email.toLowerCase(),
          name: validatedData.name
        }
      }))

    // Create registration
    const registration = await prisma.eventRegistration.create({
      data: {
        userId: user.id,
        eventId: event.id,
        status: event.requiresApproval ? 'PENDING' : 'APPROVED',
        customFields: validatedData.customFieldsData,
        paid: false
      }
    })

    // Update event's custom fields data
    if (validatedData.customFieldsData) {
      const currentCustomFields = event.customFields
        ? (event.customFields as CustomFieldsSchemaType)
        : { fields: [], eventData: [] }

      const updatedCustomFields: CustomFieldsSchemaType = {
        fields: currentCustomFields.fields,
        eventData: [
          ...(currentCustomFields.eventData || []),
          {
            registrationId: registration.id,
            userId: user.id,
            ...validatedData.customFieldsData
          }
        ]
      }

      await prisma.event.update({
        where: { id: eventId },
        data: { customFields: updatedCustomFields }
      })
    }

    // Ticket creation
    const ticketsRequirePayment = event.tickets.some(
      t => t.price.toNumber() > 0
    )
    const ticketCreations = Object.entries(validatedData.tickets).flatMap(
      ([ticketTypeId, quantity]) => {
        const ticketType = event.tickets.find(t => t.id === ticketTypeId)
        if (!ticketType)
          throw new Error(`Invalid ticket type ID: ${ticketTypeId}`)

        return Array.from({ length: quantity }, () => ({
          registrationId: registration.id,
          userId: user.id,
          category: ticketType.category,
          ticketTypeId: ticketType.id
        }))
      }
    )

    await Promise.all([
      prisma.ticket.createMany({ data: ticketCreations }),
      ticketsRequirePayment || registration.status === AttendeeStatus.PENDING
        ? null
        : prisma.queueJob.create({
            data: {
              type: 'SEND_USER_MESSAGE',
              data: { userId: user.id, eventId: event.id },
              notificationType: 'RESERVATION_CONFIRMED',
              userId: user.id,
              eventId: event.id
            }
          })
    ])

    await setRegistrationCookie(eventId, registration.id)
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
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to create registration'
    }
  }
}
