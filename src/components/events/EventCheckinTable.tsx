'use client'

import { EventRegistrationSchemaType } from '@/schemas/eventSchema'
import CheckinButton from './CheckinButton'
import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

export default function EventCheckinTable({
  eventId,
  registrations,
  ticketId
}: {
  eventId: string
  registrations: EventRegistrationSchemaType[]
  ticketId?: string
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 1500) // 1.5 seconds

  // Memoize the filtered results
  const filteredRegistrations = useMemo(
    () =>
      debouncedSearchQuery.length
        ? registrations.filter(registration =>
            registration.tickets.some(ticket =>
              ticket.user?.name
                ?.toLowerCase()
                .includes(debouncedSearchQuery.toLowerCase())
            )
          )
        : registrations,
    [registrations, debouncedSearchQuery] // Only recompute when these dependencies change
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Ticket ID</th>
            <th className="px-4 py-2 text-left">Checked In</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {filteredRegistrations.map(registration =>
            registration.tickets.map(ticket => (
              <tr key={ticket.id} className="border-b">
                <td className="px-4 py-2">{ticket.user?.name || 'N/A'}</td>
                <td className="px-4 py-2">{ticket.id}</td>
                <td className="px-4 py-2">
                  {ticket.checkedInDate
                    ? ticket.checkedInDate.toLocaleString()
                    : 'No'}
                </td>
                <td className="px-4 py-2">
                  <CheckinButton
                    eventId={eventId}
                    ticket={ticket}
                    selected={ticket.id === ticketId}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
