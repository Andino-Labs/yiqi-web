import { NextRequest, NextResponse } from 'next/server'
import {
  WhatsAppWebhookSchema,
  TextMessagePayloadSchema
} from '@/schemas/whatsappSchema'
import { handleTextMessageReceived } from '@/lib/whatsapp/handleTextMessageReceived'

const { WEBHOOK_VERIFY_TOKEN } = process.env

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const webhookData = WhatsAppWebhookSchema.parse(body)

    const entry = webhookData.entry[0]
    const message = entry?.changes[0]?.value?.messages?.[0]

    if (message) {
      switch (message.type) {
        case 'text':
          const textMessagePayload = TextMessagePayloadSchema.parse(body)
          await handleTextMessageReceived(textMessagePayload)
          break
        case 'image':
          // Handle image message
          break
        case 'video':
          // Handle video message
          break
        case 'audio':
          // Handle audio message
          break
        case 'document':
          // Handle document message
          break
        case 'location':
          // Handle location message
          break
        case 'button':
          // Handle button reply
          break
        case 'interactive':
          // Handle list reply
          break
        default:
          console.debug('Unhandled message type:', message.type)
      }
    }

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new NextResponse(null, { status: 400 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
    console.log('Webhook verified successfully!')
    return new NextResponse(challenge, { status: 200 })
  } else {
    return new NextResponse(null, { status: 403 })
  }
}
