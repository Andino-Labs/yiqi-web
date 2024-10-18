'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import {
  EventSchema,
  EventInput,
  createAttendeeSchema,
  DbEventSchema
} from '@/schemas/eventSchema'
import { z } from 'zod'
import setupInitialEventNotifications from '../notifications/setupInitialNotifications'
import { getUser, isOrganizerAdmin } from '@/lib/auth/lucia'
import { GenerateEventOpenGraphJobSchema } from '@/schemas/mediaJobs'

type DbEvent = z.infer<typeof DbEventSchema>

export async function getOrganizationEvents(
  organizationId: string
): Promise<DbEvent[]> {
  const events = await prisma.event.findMany({
    where: { organizationId },
    orderBy: { startDate: 'asc' }
  })

  return events.map(event => DbEventSchema.parse(event))
}

export async function getEvent(eventId: string): Promise<DbEvent> {
  const event = await prisma.event.findUniqueOrThrow({
    where: { id: eventId }
  })

  return DbEventSchema.parse(event)
}

export async function createEvent(organizationId: string, eventData: unknown) {
  const currentUser = await getUser()
  if (
    !currentUser ||
    !(await isOrganizerAdmin(organizationId, currentUser.id))
  ) {
    throw new Error('Unauthorized')
  }

  const validatedData = EventSchema.parse(eventData) as EventInput

  const event = await prisma.event.create({
    data: {
      ...validatedData,
      organizationId
    }
  })

  // Create a job for generating the open graph image
  await prisma.queueJob.create({
    data: {
      type: 'GENERATE_EVENT_OPEN_GRAPH',
      status: 'PENDING',
      data: GenerateEventOpenGraphJobSchema.parse({ eventId: event.id }),
      priority: 1,
      organizationId: organizationId,
      eventId: event.id
    }
  })

  revalidatePath(`/admin/organizations/${organizationId}/events`)
  return DbEventSchema.parse(event)
}

export async function updateEvent(eventId: string, eventData: unknown) {
  const event = await getEvent(eventId)
  if (!event) throw new Error('Event not found')

  const currentUser = await getUser()
  if (
    !currentUser ||
    !(await isOrganizerAdmin(event.organizationId, currentUser.id))
  ) {
    throw new Error('Unauthorized')
  }

  const validatedData = EventSchema.parse(eventData) as EventInput

  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: validatedData
  })

  revalidatePath(`/admin/organizations/${event.organizationId}/events`)
  return DbEventSchema.parse(updatedEvent)
}

export async function deleteEvent(eventId: string) {
  const event = await getEvent(eventId)
  if (!event) throw new Error('Event not found')

  const currentUser = await getUser()
  if (
    !currentUser ||
    !(await isOrganizerAdmin(event.organizationId, currentUser.id))
  ) {
    throw new Error('Unauthorized')
  }

  await prisma.event.delete({ where: { id: eventId } })

  revalidatePath(`/admin/organizations/${event.organizationId}/events`)
}

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

  await setupInitialEventNotifications({
    userId: user.id,
    eventId: event.id,
    eventStartDate: event.startDate,
    orgId: event.organizationId
  })
  return registration
}

export async function getPublicEvents(): Promise<DbEvent[]> {
  const now = new Date()
  const events = await prisma.event.findMany({
    where: {
      endDate: { gte: now }
    },
    orderBy: { startDate: 'asc' }
  })

  return events.map(event => DbEventSchema.parse(event))
}

export async function getUserRegistrationStatus(
  eventId: string,
  userId: string
) {
  const attendee = await prisma.eventRegistration.findUnique({
    where: {
      eventId_userId: {
        eventId,
        userId
      }
    }
  })
  return attendee ? true : false
}

export async function getEventDetails(eventId: string) {
  const event = await getEvent(eventId)

  return DbEventSchema.parse(event)
}
