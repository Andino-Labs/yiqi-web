'use server'

import prisma from '@/lib/prisma'
import { generateEmbedding } from './generateEmbedding'
import pgvector from 'pgvector'
import {
  createConversation,
  sendMessage
} from '@/lib/llm/messages-api/bedrockWrapper'
import { AWS_BEDROCK_MODELS } from '@/lib/llm/models'
import { z } from 'zod'

const parseSchema = z.array(
  z.object({
    type: z.any(),
    text: z.string().min(1)
  })
)

function parseSendMessageResult(result: unknown): string {
  const parsed = parseSchema.parse(result)
  return parsed[0].text
}

export async function processUserMatches(userId: string, eventId: string) {
  // Get user and event data
  const [user, event] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { userDetailedProfile: true }
    }),
    prisma.event.findUniqueOrThrow({
      where: { id: eventId },
      select: { description: true }
    })
  ])

  if (!user.userDetailedProfile) {
    throw new Error('User profile not processed yet')
  }

  // Create embedding search string
  const conversation = createConversation({
    model: AWS_BEDROCK_MODELS.CLAUDE_3_5_v2_SONNET,
    maxTokens: 1000,
    temperature: 0.5
  })

  const embeddingPrompt = `Create a search query combining these elements:
- My top skills: [Extract from profile]
- Event focus: ${event.description}
- Desired collaboration types: [Identify from career goals]
- Industry keywords: [Extract from experience]

Combine these into a natural language search string for finding professionals with:
1. Complementary expertise in [My Industry]
2. Experience with [Relevant Technologies]
3. Interest in [My Project Types]

Profile: ${user.userDetailedProfile}
Return only the search string without commentary.`

  const searchString = parseSendMessageResult(
    await sendMessage(conversation, embeddingPrompt)
  )

  // Generate embedding for the search
  const rawEmbedding = await generateEmbedding(searchString)
  const embedding = pgvector.toSql(rawEmbedding)

  // Find top 3 matches
  const matches = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT u.id 
    FROM "User" u
    INNER JOIN "EventRegistration" er ON u.id = er."userId"
    WHERE er."eventId" = ${eventId}
    AND u.id != ${userId}
    AND u.embedding IS NOT NULL
    ORDER BY u.embedding <=> ${embedding}::vector
    LIMIT 3
  `

  // Process each match with LLM
  for (const match of matches) {
    const matchUser = await prisma.user.findUniqueOrThrow({
      where: { id: match.id },
      select: { userDetailedProfile: true }
    })

    const conversation = createConversation({
      model: AWS_BEDROCK_MODELS.CLAUDE_3_5_v2_SONNET,
      maxTokens: 500,
      temperature: 0.6
    })

    // Generate key insights
    const keyInsightsPrompt = `Analyze these profiles and highlight 3 key matching factors. Focus on:
    1. Complementary skills/experience pairing
    2. Shared values or professional interests
    3. Potential synergy areas

    Format as:
    - Key Match Factor 1: [Concise title] 
      • [Specific reason from profiles]
    - Key Match Factor 2: [Concise title]
      • [Specific reason from profiles] 
    - Key Match Factor 3: [Concise title]
      • [Specific reason from profiles]

    My Profile: ${user.userDetailedProfile}
    Match Profile: ${matchUser.userDetailedProfile}

    Responde en español usando términos profesionales.`

    const keyInsights = parseSendMessageResult(
      await sendMessage(conversation, keyInsightsPrompt)
    )

    // Generate collaboration reasons
    const collaborationPrompt = `Identify collaboration opportunities between these professionals. Consider:
    - Industry trends they could address together
    - Resource/knowledge exchange potential
    - Complementary strengths that create new value

    Structure response as:
    Collaboration Potential: [1-sentence overview]
    Opportunity Areas:
    1. [Area 1] - [Specific reason]
    2. [Area 2] - [Specific reason] 
    3. [Area 3] - [Specific reason]

    Next Steps: [Actionable meeting suggestions]

    My Profile: ${user.userDetailedProfile}
    Match Profile: ${matchUser.userDetailedProfile}

    Por favor responde en español usando un tono profesional.`

    const collaborationReason = parseSendMessageResult(
      await sendMessage(conversation, collaborationPrompt)
    )

    // Create networking match
    await prisma.networkingMatch.create({
      data: {
        user: { connect: { id: userId } },
        event: { connect: { id: eventId } },
        registration: {
          connect: {
            eventId_userId: {
              eventId,
              userId
            }
          }
        },
        personDescription: keyInsights,
        matchReason: collaborationReason
      }
    })

    // Rate limit delay
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
}
