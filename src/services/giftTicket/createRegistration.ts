'use server'

import prisma from '@/lib/prisma'
import {
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

        return registration
    } catch (error) {
        throw new Error(`${error}`)
    } finally {
        await prisma.$disconnect()
    }
}
