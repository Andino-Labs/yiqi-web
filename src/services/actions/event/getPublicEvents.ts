'use server'

import prisma from '@/lib/prisma'
import { PublicEventSchema } from '@/schemas/eventSchema'
import { EventTypes, Prisma } from '@prisma/client'

export async function getPublicEvents(filters?: {
  title?: string
  location?: string
  startDate?: string
  type?: string
  page?: number
  limit?: number
}) {
  const now = new Date()

  const whereClause: Prisma.EventWhereInput = {
    startDate: { gte: now }
  }

  if (filters?.title) {
    whereClause.title = { contains: filters.title, mode: 'insensitive' }
  }

  if (filters?.location) {
    const [city, country] = filters.location.split(',').map(str => str.trim())
    if (city && country) {
      whereClause.city = { contains: city, mode: 'insensitive' }
      whereClause.country = { contains: country, mode: 'insensitive' }
    } else if (city) {
      whereClause.city = { contains: city, mode: 'insensitive' }
    } else if (country) {
      whereClause.country = { contains: country, mode: 'insensitive' }
    }
  }

  if (filters?.startDate) {
    const startOfDay = Date.parse(`${filters.startDate}T00:00:00Z`)
    const endOfDay = Date.parse(`${filters.startDate}T23:59:59Z`)

    whereClause.startDate = {
      gte: new Date(startOfDay),
      lte: new Date(endOfDay)
    }
  }

  if (filters?.type) {
    whereClause.type = { equals: filters.type as EventTypes }
  }

  const [totalCount, events] = await Promise.all([
    prisma.event.count({ where: whereClause }),
    prisma.event.findMany({
      where: whereClause,
      skip:
        filters?.page && filters?.limit
          ? (filters.page - 1) * filters.limit
          : 0,
      take: filters?.limit || 8,
      include: {
        organization: {
          select: {
            logo: true,
            name: true
          }
        },
        registrations: {
          select: {
            id: true
          }
        }
      },
      orderBy: { startDate: 'asc' }
    })
  ])

  return {
    events: events.map(event =>
      PublicEventSchema.parse({
        ...event,
        registrations: event.registrations.length
      })
    ),
    totalCount
  }
}
