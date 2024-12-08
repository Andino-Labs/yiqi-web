import { whatsappWebhook } from './service/webhook'
import { formatPhoneNumber } from './service/phoneParser'
import { CLOUD_API_URL } from './service/config'
import { makeMessageRequest } from './service/messageRequestTemplate'
import Elysia from 'elysia'
import { bulkMessagesGroup } from './service/bulkMessagesEndpoints'

export { whatsappWebhook, formatPhoneNumber, CLOUD_API_URL, makeMessageRequest }

export const whatsappModule = new Elysia().group('/whatsapp', app =>
  app.use(whatsappWebhook).use(bulkMessagesGroup)
)
