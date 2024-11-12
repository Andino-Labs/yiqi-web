import { EventForm } from '@/components/events/EventForm'
import Link from 'next/link'

export default function NewEventPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen p-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Create New Event</h1>
          <Link
            href={`/admin/organizations/${params.id}/events`}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 transition-colors"
          >
            Cancel
          </Link>
        </div>
        <EventForm organizationId={params.id} />
      </div>
    </div>
  )
}
