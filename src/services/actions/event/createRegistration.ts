import { getUser } from '@/lib/auth/lucia'
import prisma from '@/lib/prisma'
import { createAttendeeSchema, AttendeeStatus } from '@/schemas/eventSchema'
import setupInitialEventNotifications from '@/services/notifications/setupInitialNotifications'
import { getEvent } from './getEvent'

// TODO we need to update this method to handle purchases and stripe and also allow the free.
// A key component here is that we need to also create the tickets which is a sub object of the Registration itself.
export async function createRegistration(
  eventId: string,
  attendeeData: Record<string, unknown>
) {
  const event = await getEvent(eventId)
  if (!event) throw new Error('Event not found')

  const attendeeSchema = createAttendeeSchema(event.customFields)
  const validatedData = attendeeSchema.parse(attendeeData)

  const signedInUser = await getUser()

  let user = signedInUser
    ? signedInUser
    : await prisma.user.findUnique({
        where: { email: validatedData.email }
      })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name || validatedData.email.split('@')[0]
      }
    })
  }

  const registration = await prisma.eventRegistration.create({
    data: {
      userId: user.id,
      eventId: event.id,
      status: event.requiresApproval ? 'PENDING' : 'APPROVED',
      customFields: validatedData
    }
  })

  if (registration.status === AttendeeStatus.APPROVED) {
    // maybe support multiple tickets per registration in the future
    // await prisma.ticket.create({
    //   data: {
    //     registrationId: registration.id,
    //     userId: user.id
    //   }
    // })
  }

  await setupInitialEventNotifications({
    userId: user.id,
    eventId: event.id,
    eventStartDate: new Date(event.startDate),
    orgId: event.organizationId
  })

  return registration
}
