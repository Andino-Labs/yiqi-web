'use server'

import { InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import prisma from '@/lib/prisma'
import { translations } from '@/lib/translations/translations'
import { UserDataCollected, userDataCollectedShema } from '@/schemas/userSchema'
import pgvector from 'pgvector'
import { bedrockClient } from '@/lib/llm/bedrock'
import { generateEmbedding } from './generateEmbedding'

function createPrompt(collectedData: UserDataCollected): string {
  return `
Objective:
Using the provided user data, generate a detailed user profile that can help in matching them with potential co-founders or networking opportunities aligned with their goals and interests.

Instructions:
Please analyze the user's LinkedIn data and answer the following questions thoroughly. Your responses should be concise yet informative, focusing on insights that would be valuable for networking and co-founder matching.

Skills and Talents:

What skills or talents does the user have?
Highlight any endorsements, certifications, or notable achievements.
Ideal Role in a Startup:

In a room full of founders, what position would this person be best suited for if they were to start a company?
Consider their strengths, experience, and leadership qualities.
Reputation and Expertise:

What is the user known for?
Are there specific projects or contributions that stand out?
Desired Co-founder Qualities:

What kind of co-founder would they need to create a valuable startup?
Consider complementary skills, personalities, and values.
Preferred Company Type:

What kind of company would they like to work for?
Consider company size, culture, industry, and mission.
Interests and Hobbies:

What does the user like to do?
Include both professional and personal interests.
Passions:

What are they passionate about?
Look for recurring themes in their posts and engagements.
Career Intentions:

What is their main intent when it comes to their career?
Consider whether they are seeking growth, stability, innovation, etc.
Career Goals:

What are their short-term and long-term career goals?
Include any stated objectives or inferred aspirations.
Content Creation:

What kind of content do they post?
Identify topics, themes, and the nature of their posts (e.g., informative, motivational).
Content Engagement:

What kind of content do they like or react to?
This can reveal their interests and values.
Values:

What are their core values?
Look for values expressed directly or implied through their activities.
Role Models and Influencers:

Who are people they look up to?
This can include influencers they follow or individuals they frequently mention.
Social Media Activity Level:

How often do they spend time on social media?
Consider the frequency of their posts and engagements.
Industry Focus:

What industry does the user currently look for job opportunities in?
Include any industries of interest mentioned in their profile or activities.
Desired Content and Topics:

What are some topics or types of content that they would want to see more of?
This can help tailor networking opportunities to their interests.
Output Format:
Provide the information in a well-structured profile, using headings and bullet points where appropriate. Ensure that the profile reads cohesively and offers actionable insights for networking and co-founder matching.

Example Structure:

Overview
Skills and Talents
Ideal Role in a Startup
Reputation and Expertise
Desired Co-founder Qualities
Preferred Company Type
Interests and Passions
Career Intentions and Goals
Content Creation and Engagement
Core Values
Role Models and Influencers
Social Media Activity
Industry Focus
Desired Content and Topics
Additional Notes:

Use the user's own words where appropriate to preserve authenticity.
Ensure confidentiality and handle all data in compliance with privacy regulations.
Avoid making assumptions; base your analysis solely on the provided data.


Here is the user resume:
${collectedData.resumeText}\n\n

==================

Here are the user profile answers:

${translations.es.professionalMotivationsLabel}: ${collectedData.professionalMotivations}
${translations.es.communicationStyleLabel}: ${collectedData.communicationStyle}
${translations.es.professionalValuesLabel}: ${collectedData.professionalValues}
${translations.es.careerAspirationsLabel}: ${collectedData.careerAspirations}
${translations.es.significantChallengeLabel}: ${collectedData.significantChallenge}
`
}
const MODEL = 'anthropic.claude-3-sonnet-20240229-v3:0'
const SUMMARY_MODEL = 'anthropic.claude-3-sonnet-20240229-v3:0'

type Props = {
  userId: string
}

async function invokeModel(model: string, prompt: string): Promise<string> {
  const params = {
    modelId: model,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      prompt: prompt,
      max_tokens_to_sample: 2000,
      temperature: 0.7,
      top_p: 1,
      stop_sequences: ['\n\nHuman:']
    })
  }

  const command = new InvokeModelCommand(params)
  const response = await bedrockClient.send(command)

  if (!response.body) {
    throw new Error('Empty response from Bedrock')
  }

  const responseBody = JSON.parse(new TextDecoder().decode(response.body))
  return responseBody.completion
}

export async function processUserFirstPartyData({
  userId
}: Props): Promise<void> {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } })
  const dataCollected = userDataCollectedShema.parse(user.dataCollected)
  if (
    !dataCollected.resumeText &&
    !dataCollected.careerAspirations &&
    !dataCollected.communicationStyle &&
    !dataCollected.professionalMotivations &&
    !dataCollected.professionalValues &&
    !dataCollected.significantChallenge
  ) {
    throw new Error('Not enough information about the user to proceed')
  }

  const calculatedPrompt = createPrompt(dataCollected)

  const systemPrompt = `You are a community manager that is tasked with creating a deep understanding 
  of your professional network in order to improve the quality of connections for your community.
  You will be provided with a user's LinkedIn data and your task is to generate a detailed user profile that can help in matching them with potential co-founders or networking opportunities aligned with their goals and interests.`

  const userDetailedProfile = await invokeModel(
    MODEL,
    `${systemPrompt}\n\nHuman: ${calculatedPrompt}`
  )

  if (!userDetailedProfile) {
    throw new Error('User detailed profile is empty')
  }

  const userEmbeddableProfile = await invokeModel(
    SUMMARY_MODEL,
    `Create a short version of the user profile that can be used to embed in a database.\n\n${userDetailedProfile}`
  )

  if (!userEmbeddableProfile) {
    throw new Error('User embeddable profile is empty')
  }

  const userContentPreferences = await invokeModel(
    SUMMARY_MODEL,
    `${userDetailedProfile}\n\nin 3 sentences or less, what are the user's content preferences?`
  )

  if (!userContentPreferences) {
    throw new Error('User content preferences is empty')
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      userDetailedProfile: userDetailedProfile,
      userEmbeddableProfile: userEmbeddableProfile,
      userContentPreferences: userContentPreferences
    }
  })

  const rawEmbedding = await generateEmbedding(userEmbeddableProfile)
  const embedding = pgvector.toSql(rawEmbedding)

  // we cannot use prisma.user.update here because the embedding is a vector and prisma does not support it
  await prisma.$executeRaw`UPDATE "public"."User" SET embedding = ${embedding}::vector WHERE id = ${userId};`
}
