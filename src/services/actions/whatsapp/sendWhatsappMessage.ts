'use server'

import { MessageRequestBody, MessageResponse } from './types'

export async function sendSingleWhatsAppMessage(
  recipientNumber: string,
  messageText: string,
  phoneNumberId: string,
  accessToken: string
): Promise<MessageResponse> {
  'use server'

  const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`
  }

  const body: MessageRequestBody = {
    messaging_product: 'whatsapp',
    to: recipientNumber,
    text: {
      body: messageText
    }
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: MessageResponse = await response.json()
    return data
  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
    throw new Error('Failed to send WhatsApp message')
  }
}
