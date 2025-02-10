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
    max_tokens: options.maxTokens || 4048,
    messages,
    system,
    temperature: options.temperature,
    top_k: options.topK,
    top_p: options.topP,
    stop_sequences: options.stopSequences
  }
}

function createMessage(role: Message['role'], content: string): Message {
  return { role, content }
}

export async function invokeModel(
  messages: Message[],
  options: BedrockWrapperOptions,
  system?: string
): Promise<string> {
  const command = new InvokeModelCommand({
    modelId: options.model,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(createRequestBody(messages, options, system))
  })

  const response = await bedrockClient.send(command)
  const responseBody = JSON.parse(
    Buffer.from(response.body).toString('utf-8')
  ) as AnthropicResponseBody

  return responseBody.content
}

export async function streamModel(
  messages: Message[],
  options: BedrockWrapperOptions,
  system?: string
): Promise<AsyncGenerator<string, void, unknown>> {
  const command = new InvokeModelCommand({
    modelId: options.model,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(createRequestBody(messages, options, system))
  })

  const response = await bedrockClient.send(command)

  async function* streamGenerator() {
    const responseBody = JSON.parse(
      Buffer.from(response.body).toString('utf-8')
    ) as AnthropicResponseBody
    yield responseBody.content
  }

  return streamGenerator()
}

export function createConversation(
  options: BedrockWrapperOptions
): Conversation {
  return { messages: [], options }
}

export async function sendMessage(
  conversation: Conversation,
  content: string,
  system?: string
): Promise<string> {
  const updatedMessages = [
    ...conversation.messages,
    createMessage('user', content)
  ]

  const response = await invokeModel(
    updatedMessages,
    conversation.options,
    system
  )

  conversation.messages = [
    ...updatedMessages,
    createMessage('assistant', response)
  ]

  return response
}

export async function streamMessage(
  conversation: Conversation,
  content: string,
  system?: string
): Promise<AsyncGenerator<string, void, unknown>> {
  const updatedMessages = [
    ...conversation.messages,
    createMessage('user', content)
  ]

  const stream = await streamModel(
    updatedMessages,
    conversation.options,
    system
  )
  let fullResponse = ''

  async function* streamWrapper() {
    for await (const chunk of stream) {
      fullResponse += chunk
      yield chunk
    }
    conversation.messages = [
      ...updatedMessages,
      createMessage('assistant', fullResponse)
    ]
  }

  return streamWrapper()
}

export function getMessages(conversation: Conversation): Message[] {
  return [...conversation.messages]
}
