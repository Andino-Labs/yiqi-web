'use server'

import { getUser, isOrganizerAdmin } from '@/lib/auth/lucia'
import {
  sendBaseMessageToUser,
  SendBaseMessageToUserProps
} from '@/services/notifications/sendBaseMessageToUser'

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
    orgId: props.orgId,
    senderUserId: currentUser.id
  })
}
