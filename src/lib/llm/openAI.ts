import OpenAI from 'openai'

export const clientOPENAII = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})
