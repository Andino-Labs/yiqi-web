'use server'

import prisma from '@/lib/prisma'
import { z } from 'zod'
import { registrationStatsSchema } from '@/schemas/dataSchemas'

export async function getRegistrationStats(organizationId: string) {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  // Get all events for this organization
  const events = await prisma.event.findMany({
    where: {
      organizationId,
      deletedAt: null
    },
    select: {
      id: true
    }
  })

  const eventIds = events.map(event => event.id)

  // Get registrations for these events grouped by date
  const registrations = await prisma.eventRegistration.groupBy({
    by: ['createdAt'],
    where: {
      eventId: {
        in: eventIds
      },
      createdAt: {
        gte: sevenDaysAgo
      }
    },
    _count: {
      _all: true
    }
  })

  // Format the data for the chart
  const stats = registrations.map(reg => ({
    date: reg.createdAt.toISOString().split('T')[0],
    count: reg._count._all
  }))

  // Fill in missing dates with zero counts
  const allDates = new Array(7)
    .fill(0)
    .map((_, index) => {
      const date = new Date()
      date.setDate(date.getDate() - index)
      return date.toISOString().split('T')[0]
    })
    .reverse()

  const filledStats = allDates.map(date => ({
    date,
    count: stats.find(s => s.date === date)?.count || 0
  }))

  return z.array(registrationStatsSchema).parse(filledStats)
}
