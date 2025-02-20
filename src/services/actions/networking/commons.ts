import { NetworkingMatchesType } from '@/schemas/networkingMatchSchema'
import { Prisma } from '@prisma/client'

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
): NetworkingMatchesType => {
  return matches.map(match => ({
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
      dataCollected: match.user.dataCollected as Prisma.JsonObject | null // Ensure proper type assertion
    }
  }))
}
