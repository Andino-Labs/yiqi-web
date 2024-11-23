'use server'

import prisma from '@/lib/prisma'
import { userSchema } from '@/schemas/userSchema'

// org membership
export async function getOrganizationContacts(organizationId: string) {
  const pastRegistrationPromise = prisma.eventRegistration.findMany({
    where: {
      event: { organizationId }
    },
    include: {
      user: true
    },
    distinct: ['userId']
  })

  const contactPromise = prisma.organizationContact.findMany({
    where: { organizationId },
    include: {
      user: true
    }
  })

  const [pastRegistrations, contacts] = await Promise.all([
    pastRegistrationPromise,
    contactPromise
  ])

  const combinedListUserList = [
    ...pastRegistrations.map(registration => registration.user),
    ...contacts.map(contact => contact.user)
  ]

  return combinedListUserList.map(user => userSchema.parse(user))
}

export async function getContactDetails(
  userId: string,
  organizationId: string
) {
  const contact = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      registeredEvents: {
        where: { event: { organizationId } },
        include: { event: true }
      }
    }
  })

  return contact
}

export async function isUserOrganizationAdmin(
  userId: string,
  organizationId: string
) {
  const membership = await prisma.organizer.findFirst({
    where: {
      userId,
      organizationId,
      role: 'ADMIN'
    }
  })
  return !!membership
}
