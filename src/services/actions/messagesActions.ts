'use server'

import prisma from '@/lib/prisma'
import {
  sendUserWhatsappMessage,
  sendUserWhatsappMessageProps
} from '@/lib/whatsapp/sendUserWhatsappMessage'
import { getUser, isEventAdmin, isOrganizerAdmin } from '@/lib/auth/lucia'
import {
  OrgMessageListItemSchema,
  MessageListSchema
} from '@/schemas/messagesSchema'
import {
  sendBaseMessageToUser,
  SendBaseMessageToUserProps
} from '../notifications/sendBaseMessageToUser'
import { NotificationType } from '@prisma/client'

export async function getUserMessageList(
  userId: string,
  orgId: string,
  cursorId?: string
) {
  const currentUser = await getUser()
  if (!currentUser) throw new Error('Unauthorized')

  const isAllowed = await isOrganizerAdmin(orgId, currentUser.id)
  if (!isAllowed) {
    throw new Error('Unauthorized: no access to event or organization')
  }

  const messageList = await prisma.message.findMany({
    where: {
      OR: [{ senderUserId: userId }, { destinationUserId: userId }],
      messageThread: {
        organizationId: orgId
      }
    },
    take: 20,
    ...(cursorId && {
      cursor: { id: cursorId },
      skip: 1 // Skip the cursor itself
    }),
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      senderUser: {
        select: { id: true, name: true, picture: true }
      },
      destinationUser: {
        select: { id: true, name: true, picture: true }
      },
      messageThread: {
        select: {
          type: true,
          id: true
        }
      }
    }
  })

  return MessageListSchema.parse(messageList)
}

export async function sendUserWhatsappMessageAction(
  props: sendUserWhatsappMessageProps & { eventId?: string | undefined }
) {
  const currentUser = await getUser()
  if (!currentUser) throw new Error('Unauthorized')

  if (props.eventId) {
    const isAllowed = await isEventAdmin(props.eventId, currentUser.id)

    if (!isAllowed) {
      throw new Error('Unauthorized: not allowed to see messages')
    }
  }

  return sendUserWhatsappMessage({ ...props, senderUserId: currentUser.id })
}

export async function getOrganizationMessageThreads(orgId: string) {
  const currentUser = await getUser()
  if (!currentUser) throw new Error('Unauthorized')

  const isAllowed = await isOrganizerAdmin(orgId, currentUser.id)

  if (!isAllowed) {
    throw new Error('Unauthorized: no access to event or organization')
  }

  const messageThreads = await prisma.messageThread.findMany({
    where: {
      organizationId: orgId
    },
    orderBy: {
      updatedAt: 'desc'
    },
    take: 100,
    distinct: ['contextUserId'],
    include: {
      contextUser: true,
      messages: {
        orderBy: {
          createdAt: 'desc'
        },
        take: 1
      }
    }
  })

  return messageThreads.map(thread => OrgMessageListItemSchema.parse(thread))
}

export async function sendUserCommunicationAction(
  props: SendBaseMessageToUserProps
) {
  const currentUser = await getUser()
  if (!currentUser) throw new Error('Unauthorized')

  const isAllowed = await isOrganizerAdmin(props.orgId, currentUser.id)
  if (!isAllowed) {
    throw new Error('Unauthorized: no access to event or organization')
  }

  return sendBaseMessageToUser({
    destinationUserId: props.destinationUserId,
    content: props.content,
    messageType: props.messageType,
    orgId: props.orgId
  })
}

// adds the notifications to the notifictions queue for the cron job to handle.
// we do this because we don't want to block the request if the list is large
// and we want to be able to send multiple messages in a row without waiting for the previous one to finish
export async function sendBulkMessagesAction({
  eventId,
  ...props
}: SendBaseMessageToUserProps & {
  eventId?: string
}) {
  const currentUser = await getUser()
  if (!currentUser) throw new Error('Unauthorized')

  const isAllowed = await isOrganizerAdmin(props.orgId, currentUser.id)
  if (!isAllowed) {
    throw new Error('Unauthorized: not allowed to see messages')
  }

  const events = await prisma.event.findMany({
    where: eventId
      ? {
          id: eventId
        }
      : {
          organizationId: props.orgId
        },
    include: {
      registrations: {
        include: {
          user: {
            select: {
              id: true
            }
          }
        }
      }
    }
  })

  const notificationsToSend: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    extraData: any
    userId: string
    eventId: string
    organizationId: string
    type: NotificationType
    scheduledFor: Date
  }[] = []

  events.forEach(event => {
    event.registrations.forEach(registration => {
      notificationsToSend.push({
        userId: registration.user.id,
        eventId: event.id,
        organizationId: event.organizationId,
        type: NotificationType.BASE_NOTIFICATION,
        extraData: props,
        scheduledFor: new Date()
      })
    })
  })

  const notifications = await prisma.notification.createMany({
    data: notificationsToSend
  })

  return notifications
}
