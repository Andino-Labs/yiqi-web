'use client'

import React, { useState, useEffect } from 'react'
import PublicEventsList from '@/components/events/PublicEventsList'
import SearchForm from '@/components/mainLanding/SearchForm'
import { getPublicEvents } from '@/services/actions/event/getPublicEvents'
import { getDistinctCities } from '@/services/actions/event/getDistinctCities'
import { PublicEventType } from '@/schemas/eventSchema'
import { Button } from '@/components/ui/button'

const EventsContainer = () => {
  const [locations, setLocations] = useState<string[]>([])
  const [filteredEvents, setFilteredEvents] = useState<PublicEventType[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [filters, setFilters] = useState<{
    title: string
    location: string
    startDate: string
    type: string
  }>({
    title: '',
    location: '',
    startDate: '',
    type: ''
  })
  const eventsPerPage = 8

  useEffect(() => {
    const fetchCities = async () => {
      const cities = await getDistinctCities()

      const formattedCities = cities.map(
        location => `${location.city}, ${location.country}`
      )
      setLocations(formattedCities)
    }

    fetchCities()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const { events, totalCount } = await getPublicEvents({
        ...filters,
        page: currentPage,
        limit: eventsPerPage
      })
      setFilteredEvents(events)
      setTotalCount(totalCount)
    }

    fetchData()
  }, [filters, currentPage])

  const handleSearch = (newFilters: {
    title: string
    location: string
    startDate: string
    type: string
  }) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(totalCount / eventsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="lg:max-w-[80%] max-w-[90%] mx-auto flex flex-col lg:flex-row">
      <div className="flex-1">
        <SearchForm onSearch={handleSearch} locations={locations} />
        <div className="bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mt-8" />
        <PublicEventsList showHeader={false} events={filteredEvents} />
        <div className="bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-md ${
                  page === currentPage
                    ? 'font-bold bg-gradient-to-r from-[#04F1FF] to-[#6de4e8] text-black hover:opacity-90 transition-opacity'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {page}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EventsContainer
