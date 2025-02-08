'use server'

import {
  sendBaseMessageToUser,
  SendBaseMessageToUserProps
} from '@/services/notifications/sendBaseMessageToUser'

export async function sendUserCommunicationsForServer(
  props: SendBaseMessageToUserProps
) {
  return sendBaseMessageToUser({
    destinationUserId: props.destinationUserId,
    content: props.content,
    messageType: props.messageType,
    orgId: props.orgId,
    senderUserId: props.senderUserId,
    subject: props.subject
  })
}
