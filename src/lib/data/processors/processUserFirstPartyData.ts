'use server'

import prisma from '@/lib/prisma'
import { translations } from '@/lib/translations/translations'
import {
  type UserDataCollected,
  userDataCollectedShema
} from '@/schemas/userSchema'
import pgvector from 'pgvector'
import { generateEmbedding } from './generateEmbedding'
import {
  createConversation,
  sendMessage
} from '@/lib/llm/messages-api/bedrockWrapper'
import { z } from 'zod'

import { AWS_BEDROCK_MODELS } from '@/lib/llm/models'

const parseSchema = z.array(
  z.object({
    type: z.any(),
    text: z.string().min(1)
  })
)

function createPrompt(collectedData: UserDataCollected): string {
  return `
Objetivo:
Utilizando los datos proporcionados del usuario, genera un perfil detallado que ayude a conectarlo con potenciales cofundadores u oportunidades de networking alineadas con sus objetivos e intereses.

Instrucciones:
Analiza los datos de LinkedIn del usuario y responde las siguientes preguntas de manera exhaustiva. Tus respuestas deben ser concisas pero informativas, enfocándote en insights valiosos para networking y búsqueda de cofundadores.

Habilidades y Talentos:
¿Qué habilidades o talentos posee el usuario?
Destaca endorsements, certificaciones o logros relevantes.

Rol Ideal en una Startup:
¿Qué posición ocuparía esta persona en una startup considerando sus fortalezas y experiencia?
Considera sus habilidades de liderazgo y cualidades profesionales.

Reputación y Experiencia:
¿Por qué es conocido el usuario?
Menciona proyectos o contribuciones destacadas.

Cualidades Deseadas en Cofundador:
¿Qué tipo de cofundador necesitaría para crear una startup exitosa?
Describe habilidades complementarias y valores compatibles.

Tipo de Compañía Preferida:
¿En qué tipo de empresa le gustaría trabajar?
Considera tamaño, cultura corporativa, industria y misión.

Intereses y Pasatiempos:
¿Qué actividades profesionales/personales disfruta?
Incluye tanto intereses laborales como hobbies.

Pasiones:
¿Qué temas le apasionan?
Identifica patrones en sus publicaciones e interacciones.

Intenciones Profesionales:
¿Cuál es su principal objetivo profesional?
Menciona si busca crecimiento, estabilidad, innovación, etc.

Metas Profesionales:
¿Cuáles son sus metas a corto y largo plazo?
Incluye objetivos declarados o aspiraciones inferidas.

Creación de Contenido:
¿Qué tipo de contenido publica?
Identifica temas, formatos y tono (ej. informativo, motivacional).

Interacción con Contenido:
¿Qué tipo de contenido suele consumir o compartir?
Esto revela sus intereses y valores personales.

Valores:
¿Cuáles son sus valores fundamentales?
Identifica principios expresados directa o indirectamente.

Modelos a Seguir:
¿A quiénes admira profesionalmente?
Menciona influencers que sigue o personas que cita frecuentemente.

Actividad en Redes Sociales:
¿Qué tan activo es en redes sociales?
Considera frecuencia de publicaciones e interacciones.

Enfoque de Industria:
¿En qué industria busca oportunidades laborales?
Incluye sectores mencionados en su perfil.

Contenido de Interés:
¿Qué tipo de contenido le gustaría ver más?
Útil para personalizar oportunidades de networking.

Formato de Salida:
Proporciona la información en español usando encabezados y viñetas. Asegura coherencia y insights accionables para networking.

Estructura Ejemplo:
Resumen
Habilidades y Talentos
Rol Ideal en Startup
Reputación y Experiencia
Cualidades Deseadas en Cofundador
Tipo de Compañía Preferida
Intereses y Pasiones
Metas Profesionales
Creación e Interacción de Contenido
Valores Fundamentales
Modelos a Seguir
Actividad en Redes
Enfoque de Industria
Contenido de Interés

Notas Adicionales:
1. Usa las palabras del usuario cuando sea posible para mantener autenticidad
2. Asegura confidencialidad y cumplimiento de regulaciones de privacidad
3. Evita suposiciones no respaldadas por datos
4. Todas las respuestas deben estar exclusivamente en español

Resumen del usuario:
${collectedData.resumeText}\n\n

==================

Respuestas del cuestionario:

${translations.es.professionalMotivationsLabel}: ${collectedData.professionalMotivations}
${translations.es.communicationStyleLabel}: ${collectedData.communicationStyle}
${translations.es.professionalValuesLabel}: ${collectedData.professionalValues}
${translations.es.careerAspirationsLabel}: ${collectedData.careerAspirations}
${translations.es.significantChallengeLabel}: ${collectedData.significantChallenge}
`
}

function parseSendMessageResult(result: unknown): string {
  const parsed = parseSchema.parse(result)
  return parsed[0].text
}

export async function processUserFirstPartyData(userId: string): Promise<void> {
  const systemPrompt: string =
    "You are a community manager that is tasked with creating a deep understanding of your professional network in order to improve the quality of connections for your comunity. You will be provided with a user's LinkedIn data and your task is to generate a detailed user profile that can help in matching them with potential co-founders or networking opportunities aligned with their goals and interests."

  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } })

  const dataCollected = userDataCollectedShema.parse(user.dataCollected)

  if (!dataCollected.resumeText) {
    console.log('missing resume so we cannot process this user')
    return
  }

  const conversation = createConversation({
    model: AWS_BEDROCK_MODELS.CLAUDE_HAIKU_3_5,
    maxTokens: 2000,
    temperature: 0.7,
    topP: 1
  })

  const calculatedPrompt = createPrompt(dataCollected)

  const profileResult = parseSendMessageResult(
    await sendMessage(conversation, calculatedPrompt, systemPrompt)
  )

  if (!profileResult) {
    throw new Error('User detailed profile is empty')
  }

  console.info('Profile result call was successful')

  await new Promise(resolve => {
    setTimeout(resolve, 1000)
  })

  const userEmbeddableProfile = parseSendMessageResult(
    await sendMessage(
      conversation,
      `Summarize the following user profile for embedding into a database: ${profileResult}`
    )
  )

  if (!userEmbeddableProfile) {
    throw new Error('No embeddable profile was found')
  }

  console.info('User embeddable profile result call was successful')

  await new Promise(resolve => {
    setTimeout(resolve, 1000)
  })

  const userContentPreferencesResult = parseSendMessageResult(
    await sendMessage(
      conversation,
      `In 3 sentences or less, what are the user's content preferences?  \n\n ${profileResult}`
    )
  )

  if (!userContentPreferencesResult) {
    throw new Error('No user content preference was done')
  }

  console.info('userContentPreferencesResult call was successful')

  await prisma.user.update({
    where: { id: userId },
    data: {
      userDetailedProfile: profileResult,
      userEmbeddableProfile: userEmbeddableProfile,
      userContentPreferences: userContentPreferencesResult
    }
  })

  await new Promise(resolve => {
    setTimeout(resolve, 1000)
  })

  const rawEmbedding = await generateEmbedding(userEmbeddableProfile)

  if (!rawEmbedding) {
    throw new Error('No embedding was generated')
  }
  const embedding = pgvector.toSql(rawEmbedding)
  await prisma.$executeRaw`UPDATE "public"."User" SET embedding = ${embedding}::vector WHERE id = ${userId};`
}
