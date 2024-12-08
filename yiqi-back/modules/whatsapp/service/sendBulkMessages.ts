import {
  makeMessageRequest,
  MakeMessageRequestConfig,
  MakeMessageRequestBody,
  MessageContent
} from './messageRequestTemplate'

type BulkMessageRequest<T extends MessageContent> = {
  config: MakeMessageRequestConfig
  messages: Array<MakeMessageRequestBody<T>>
}

async function sendBulkMessages<T extends MessageContent>(
  requests: BulkMessageRequest<T>[]
): Promise<void> {
  const allPromises = requests.flatMap(request =>
    request.messages.map(message => makeMessageRequest(request.config, message))
  )
  try {
    await Promise.all(allPromises)
    console.log('All messages sent successfully')
  } catch (error) {
    console.error('Error sending bulk messages:', error)
    throw error
  }
}

export { sendBulkMessages }
export type { BulkMessageRequest }
