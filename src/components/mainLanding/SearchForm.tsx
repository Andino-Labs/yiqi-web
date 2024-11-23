'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { ChevronUpIcon, Cross2Icon } from '@radix-ui/react-icons'
import { EventTypeEnum } from '@/schemas/eventSchema'
import { ChevronDownIcon } from 'lucide-react'
import useWindowSize from '@/hooks/useWindowSize'
import { translations } from '@/lib/translations/translations'

interface SearchFormProps {
  onSearch: (filters: {
    title: string
    location: string
    startDate: string
    type: string
  }) => void
  locations: string[]
}

export default function SearchForm({ onSearch, locations }: SearchFormProps) {
  const [location, setLocation] = useState('')
  const [title, setTitle] = useState('')
  const [startDate, setStartDate] = useState('')
  const [type, setType] = useState<EventTypeEnum | ''>('')
  const [showAdditionalFilters, setShowAdditionalFilters] = useState(false)
  const { width } = useWindowSize()

  const isMobile = width <= 768

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const backendEventType =
      type === EventTypeEnum.ONLINE
        ? EventTypeEnum.ONLINE
        : type === EventTypeEnum.IN_PERSON
          ? EventTypeEnum.IN_PERSON
          : ''
    const filters = {
      title,
      location,
      startDate,
      type: backendEventType
    }

    onSearch(filters)
  }

  return (
    <div className="bg-black relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-16 lg:py-16 lg:pb-0 pb-0 sm:py-16">
        <div>
          <div className="flex items-center space-x-4">
            <p>{translations.es.welcome}</p>
          </div>
        </div>
        <form
          className="flex flex-wrap justify-start items-center gap-6 p-4 bg-gray-900/80 backdrop-blur-sm rounded-lg shadow-md mx-auto max-w-5xl"
          onSubmit={handleSubmit}
        >
          {/* Campo para Título */}
          <div className="flex flex-col space-y-2 pl-2 w-full sm:w-1/5">
            <label className="text-gray-500 text-sm">
              {translations.es.eventTitle}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={translations.es.searchByTitle}
                className={`border-b-2 text-sm p-2 w-full rounded-md ${
                  !title
                    ? 'border-gray-400 text-gray-500'
                    : 'border-gray-300 focus:outline-none focus:border-blue-500'
                }`}
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              {title && (
                <button
                  type="button"
                  className="absolute top-2 right-2"
                  onClick={() => setTitle('')}
                >
                  <Cross2Icon
                    className="w-5 h-5 text-gray-500"
                    style={{ width: '1rem' }}
                  />
                </button>
              )}
            </div>
          </div>

          {/* Campo para Ubicación */}
          <div className="flex flex-col space-y-2 pl-2 w-full sm:w-1/5">
            <label className="text-gray-500 text-sm">
              {translations.es.location}
            </label>
            <div className="relative">
              <select
                className={`border-b-2 text-sm p-[0.659375rem] w-full rounded-md bg-white pl-[0.15625rem] ${
                  !location
                    ? 'border-gray-400 text-gray-500'
                    : 'border-gray-300 focus:outline-none focus:border-blue-500'
                }`}
                value={location}
                onChange={e => setLocation(e.target.value)}
              >
                <option value="" className="text-gray-400">
                  {translations.es.selectLocation}
                </option>
                {locations.map((loc, index) => (
                  <option key={index} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              {location && (
                <button
                  type="button"
                  className="absolute top-2 right-2"
                  onClick={() => setLocation('')}
                >
                  <Cross2Icon
                    className="w-5 h-5 text-gray-500"
                    style={{ width: '1rem' }}
                  />
                </button>
              )}
            </div>
          </div>

          {/* Botón para mostrar u ocultar los filtros adicionales (solo en mobile) */}
          {isMobile && (
            <div className="w-full sm:hidden flex justify-between items-center mt-4">
              <button
                type="button"
                className="text-sm text-white flex items-center"
                onClick={() => setShowAdditionalFilters(prev => !prev)}
              >
                {showAdditionalFilters ? (
                  <ChevronUpIcon className="w-5 h-5 mr-2" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 mr-2" />
                )}
                {showAdditionalFilters
                  ? translations.es.hideFilters
                  : translations.es.showMoreFilters}
              </button>
            </div>
          )}

          {(!isMobile || (isMobile && showAdditionalFilters)) && (
            <>
              <div className="flex flex-col space-y-2 pl-2 w-full sm:w-1/5">
                <label className="text-gray-500 text-sm">
                  {translations.es.startDate}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className={`border-b-2 text-sm p-2 w-full rounded-md ${
                      !startDate
                        ? 'border-gray-400 text-gray-500'
                        : 'border-gray-300 focus:outline-none focus:border-blue-500'
                    }`}
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-2 pl-2 w-full sm:w-1/5">
                <label className="text-gray-500 text-sm">
                  {translations.es.eventType}
                </label>
                <div className="relative">
                  <select
                    className={`border-b-2 text-sm p-2 w-full rounded-md bg-white pl-[0.15625rem] ${
                      !type
                        ? 'border-gray-400 text-gray-500'
                        : 'border-gray-300 focus:outline-none focus:border-blue-500'
                    }`}
                    value={type}
                    onChange={e => setType(e.target.value as EventTypeEnum)}
                  >
                    <option value="" className="text-gray-400">
                      {translations.es.selectEventType}
                    </option>
                    <option value={EventTypeEnum.ONLINE}>
                      {translations.es.virtual}
                    </option>
                    <option value={EventTypeEnum.IN_PERSON}>
                      {translations.es.onsite}
                    </option>
                  </select>
                  {type && (
                    <button
                      type="button"
                      className="absolute top-2 right-2"
                      onClick={() => setType('')}
                    >
                      <Cross2Icon
                        className="w-5 h-5 text-gray-500"
                        style={{ width: '1rem' }}
                      />
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="w-full sm:w-auto mt-6 sm:mt-0 sm:pl-2 flex justify-center sm:col-span-6 pt-0 md:pt-6">
            <Button
              type="submit"
              size="sm"
              className="font-bold bg-gradient-to-r from-[#04F1FF] to-[#6de4e8] text-black hover:opacity-90 transition-opacity w-full sm:w-auto"
              style={{ paddingLeft: '1.2rem', paddingRight: '1.2rem' }}
            >
              {translations.es.search}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
