import { getOrganization } from '@/services/actions/organizationActions'
import { getContactDetails } from '@/services/actions/contactActions'
import Link from 'next/link'

export default async function ContactDetailsPage({
  params
}: {
  params: { id: string; userId: string }
}) {
  const organization = await getOrganization(params.id)
  const contact = await getContactDetails(params.userId, params.id)

  if (!organization || !contact) {
    return <div>Contact or Organization not found</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Contact Details: {contact.name}
      </h1>
      <p>Email: {contact.email}</p>
      <h2 className="text-xl font-bold mt-4 mb-2">Attended Events:</h2>
      <ul className="space-y-2">
        {contact.registeredEvents?.map(attendee => (
          <li key={attendee.id} className="border p-2 rounded">
            <Link
              href={`/admin/organizations/${params.id}/events/${attendee.event.id}`}
              className="text-blue-500 hover:underline"
            >
              {attendee.event.title}
            </Link>
            <p>Status: {attendee.status}</p>
          </li>
        ))}
      </ul>
      <Link
        href={`/admin/organizations/${params.id}/contacts`}
        className="mt-4 inline-block text-blue-500 hover:underline"
      >
        Back to Contacts
      </Link>
    </div>
  )
}
