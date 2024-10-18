import { getOrganization } from '@/services/actions/organizationActions'
import { getOrganizationContacts } from '@/services/actions/contactActions'
import Link from 'next/link'

export default async function ContactsPage({
  params
}: {
  params: { id: string }
}) {
  const organization = await getOrganization(params.id)
  const contacts = await getOrganizationContacts(params.id)

  if (!organization) {
    return <div>Organization not found</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Contacts for {organization.name}
      </h1>
      <ul className="space-y-2">
        {contacts.map(contact => (
          <li key={contact?.user?.id} className="border p-2 rounded">
            <Link
              href={`/admin/organizations/${params.id}/contacts/${contact?.user?.id}`}
              className="text-blue-500 hover:underline"
            >
              {contact?.user?.name} ({contact?.user?.email})
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={`/admin/organizations/${params.id}`}
        className="mt-4 inline-block text-blue-500 hover:underline"
      >
        Back to Organization Dashboard
      </Link>
    </div>
  )
}
