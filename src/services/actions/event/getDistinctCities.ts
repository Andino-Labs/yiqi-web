'use server'

import prisma from '@/lib/prisma'

type locationObject = { city: string; country: string }
type CacheProps = {
  cities: locationObject[]
  timeCalculated: Date | null
}
const cache: CacheProps = {
  cities: [],
  timeCalculated: null
}

export async function getDistinctCities() {
  if (cache.timeCalculated && cache.cities.length > 0) {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
    if (cache.timeCalculated > twoHoursAgo) {
      return cache.cities
    }
  }

  const results = await prisma.event.findMany({
    select: {
      city: true,
      country: true
    },
    distinct: ['city', 'country'],
    where: {
      city: {
        not: null
      },
      deletedAt: {
        equals: null
      },
      startDate: {
        gte: new Date()
      }
    }
  })

  cache.cities = results
    .map(event => ({
      city: event.city,
      country: event.country
    }))
    .filter(
      ({ city, country }) =>
        typeof city === 'string' && typeof country === 'string'
    ) as locationObject[]

  cache.timeCalculated = new Date()

  return cache.cities
}
