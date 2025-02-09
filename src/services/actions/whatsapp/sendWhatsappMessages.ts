'use server'

import { sendSingleWhatsAppMessage } from './sendWhatsappMessage'
import { MessageResponse } from './types'

export async function sendBulkWhatsAppMessages(
  recipients: string[],
  messageText: string,
  phoneNumberId: string,
  accessToken: string
): Promise<
  Array<{
    recipient: string
    success: boolean
    response?: MessageResponse
    error?: string
  }>
> {
  'use server'

  const results = []

  for (const recipient of recipients) {
    try {
      const response = await sendSingleWhatsAppMessage(
        recipient,
        messageText,
        phoneNumberId,
        accessToken
      )

      results.push({
        recipient,
        success: true,
        response: response
      })
    } catch (error) {
      console.error(`Error sending message to ${recipient}:`, error)
      results.push({
        recipient,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  return results
}
