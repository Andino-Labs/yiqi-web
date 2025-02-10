import type { AWS_BEDROCK_MODELS } from '../models'

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface AnthropicRequestBody {
  anthropic_version: string
  max_tokens: number
  messages: Message[]
  system?: string
  temperature?: number
  top_k?: number
  top_p?: number
  stop_sequences?: string[]
}

export interface AnthropicResponseBody {
  content: string
  stop_reason: string
  usage: {
    input_tokens: number
    output_tokens: number
  }
}

export interface BedrockWrapperOptions {
  model: AWS_BEDROCK_MODELS
  maxTokens?: number
  temperature?: number
  topK?: number
  topP?: number
  stopSequences?: string[]
}

export interface Conversation {
  messages: Message[]
  options: BedrockWrapperOptions
}
