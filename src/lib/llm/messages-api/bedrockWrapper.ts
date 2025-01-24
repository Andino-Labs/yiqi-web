import { InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import { bedrockClient } from '../bedrock'
import type {
  AnthropicRequestBody,
  AnthropicResponseBody,
  BedrockWrapperOptions,
  Conversation,
  Message
} from './types'

function createRequestBody(
  messages: Message[],
  options: BedrockWrapperOptions,
  system?: string
): AnthropicRequestBody {
  return {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: options.maxTokens || 2048,
    messages: messages,
    system: system,
    temperature: options.temperature,
    top_k: options.topK,
    top_p: options.topP,
    stop_sequences: options.stopSequences
  }
}

export async function invokeModel(
  messages: Message[],
  options: BedrockWrapperOptions,
  system?: string
): Promise<string> {
  const requestBody = createRequestBody(messages, options, system)

  const command = new InvokeModelCommand({
    modelId: options.model,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(requestBody)
  })

  const response = await bedrockClient.send(command)
  const responseBody: AnthropicResponseBody = JSON.parse(
    Buffer.from(response.body).toString('utf-8')
  )

  return responseBody.content
}

export async function streamModel(
  messages: Message[],
  options: BedrockWrapperOptions,
  system?: string
): Promise<AsyncGenerator<string, void, unknown>> {
  const requestBody = createRequestBody(messages, options, system)

  const command = new InvokeModelCommand({
    modelId: options.model,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(requestBody)
  })

  const response = await bedrockClient.send(command)

  async function* streamGenerator(): AsyncGenerator<string, void, unknown> {
    const responseBody: AnthropicResponseBody = JSON.parse(
      Buffer.from(response.body).toString('utf-8')
    )
    yield responseBody.content
  }

  return streamGenerator()
}

export function createConversation(
  options: BedrockWrapperOptions
): Conversation {
  return {
    messages: [],
    options: options
  }
}

export async function sendMessage(
  conversation: Conversation,
  content: string,
  system?: string
): Promise<string> {
  conversation.messages.push({ role: 'user', content: content })
  const response = await invokeModel(
    conversation.messages,
    conversation.options,
    system
  )
  console.warn(JSON.stringify(response, null, 2))
  conversation.messages.push({ role: 'assistant', content: response })
  return response
}

export async function streamMessage(
  conversation: Conversation,
  content: string,
  system?: string
): Promise<AsyncGenerator<string, void, unknown>> {
  conversation.messages.push({ role: 'user', content: content })
  const stream = await streamModel(
    conversation.messages,
    conversation.options,
    system
  )
  let fullResponse = ''

  async function* streamWrapper(): AsyncGenerator<string, void, unknown> {
    for await (const chunk of stream) {
      fullResponse += chunk
      yield chunk
    }
    // Update messages after streaming is complete
    conversation.messages.push({ role: 'assistant', content: fullResponse })
  }

  return streamWrapper()
}

export function getMessages(conversation: Conversation): Message[] {
  return conversation.messages
}
