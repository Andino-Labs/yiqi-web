/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  NetworkingMatchesType,
  networkingMatchUserSchema
} from '@/schemas/networkingMatchSchema'
import { Prisma } from '@prisma/client'
import { z } from 'zod'

const dataCollectedSchema = networkingMatchUserSchema.pick({
  dataCollected: true
})
type DataCollectedSchemaType = z.infer<typeof dataCollectedSchema>

export const parseNetworkingMatches = (
  matches: {
    id: string
    personDescription: string
    matchReason: string
    userId: string
    registrationId: string
    createdAt: Date
    updatedAt: Date
    eventId: string
    user: {
      id: string
      name: string
      picture: string | null
      dataCollected: Prisma.JsonValue
    }
  }[]
): NetworkingMatchesType =>
  matches.map(match => {
    const userDataCollected: DataCollectedSchemaType =
      match.user as DataCollectedSchemaType

    return {
      id: match.id,
      personDescription: match.personDescription,
      matchReason: match.matchReason,
      userId: match.userId,
      registrationId: match.registrationId,
      createdAt: match.createdAt,
      updatedAt: match.updatedAt,
      user: {
        id: match.user.id,
        name: match.user.name,
        picture: match.user.picture,
        dataCollected: userDataCollected.dataCollected
      }
    }
  })
