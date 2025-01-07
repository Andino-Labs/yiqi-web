'use server'

import prisma from '@/lib/prisma'

export async function getNewOrgWelcomeProps(organizationId: string) {
  const [org, contacts, event] = await Promise.all([
    prisma.organization.findUnique({
      where: { id: organizationId },
      select: { billingInfo: true }
    }),
    prisma.organizationContact.findFirst({
      where: { organizationId }
    }),
    prisma.event.findFirst({
      where: { organizationId }
    })
  ])

  return {
    hasContacts: !!contacts,
    hasEvents: !!event,
    hasNotifications: !!true,
    isStripeSetup: !!org?.billingInfo,
    hasFirstRegistration: event
      ? (await prisma.eventRegistration.findFirst({
          where: { eventId: event.id }
        })) !== null
      : false
  }
}
