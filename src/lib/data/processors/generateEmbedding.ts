'use server'

import { InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import { bedrockClient } from '@/lib/llm/bedrock'
import { AWS_BEDROCK_MODELS } from '@/lib/llm/models'

export async function generateEmbedding(raw: string) {
  // Replace newlines with spaces as recommended for best results
  const input = raw.replace(/\n/g, ' ')

  const params = {
    modelId: AWS_BEDROCK_MODELS.TITAN_EMBED_TEXT_V1,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      inputText: input
    })
  }

  const command = new InvokeModelCommand(params)

  try {
    const response = await bedrockClient.send(command)

    if (!response.body) {
      throw new Error('Empty response from Bedrock')
    }

    const responseBody = JSON.parse(new TextDecoder().decode(response.body))
    return responseBody.embedding
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw error
  }
}
