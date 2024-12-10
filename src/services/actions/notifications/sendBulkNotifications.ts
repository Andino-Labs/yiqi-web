import prisma from '@/lib/prisma'
import { SendBaseMessageToUserProps } from '@/services/notifications/sendBaseMessageToUser'
import { JobType, MessageThreadType } from '@prisma/client'

type SendBulkNotificationsProps = {
  orgId: string
  message: string
  messageType: MessageThreadType
}

export async function sendBulkNotifications({
  orgId,
  message,
  messageType
}: SendBulkNotificationsProps) {
  const peopleToSend = await prisma.organizationContact.findMany({
    where: {
      organizationId: orgId
    },
    include: {
      user: true
    }
  })
  const registrations = await prisma.eventRegistration.findMany({
    where: {
      event: {
        organizationId: orgId
      }
    },
    include: {
      user: true
    }
  })

  const dataToTake = [
    ...peopleToSend.map(person => {
      const data: SendBaseMessageToUserProps = {
        destinationUserId: person.user.id,
        content: message,
        messageType: messageType,
        orgId: orgId
      }

      return {
        userId: person.user.id,
        organizationId: orgId,
        scheduledFor: new Date(),
        type: JobType.SEND_USER_MESSAGE,
        data: data
      }
    }),
    ...registrations.map(person => {
      const data: SendBaseMessageToUserProps = {
        destinationUserId: person.user.id,
        content: message,
        messageType: messageType,
        orgId: orgId
      }

      return {
        userId: person.user.id,
        organizationId: orgId,
        scheduledFor: new Date(),
        type: JobType.SEND_USER_MESSAGE,
        data: data
      }
    })
  ]

  const notifications = await prisma.queueJob.createMany({
    data: dataToTake
  })

  console.debug(notifications)
  return { sucess: true }
}
