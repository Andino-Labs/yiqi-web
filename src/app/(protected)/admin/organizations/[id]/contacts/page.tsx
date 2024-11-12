import { getOrganization } from '@/services/actions/organizationActions'
import { getOrganizationContacts } from '@/services/actions/contactActions'
import Link from 'next/link'
import OrganizationLayout from '@/components/orgs/OrganizationLayout'
import { getUser } from '@/lib/auth/lucia'

export default async function ContactsPage({
  params
}: {
  params: { id: string }
}) {
  const user = await getUser()

  const organization = await getOrganization(params.id)
  const contacts = await getOrganizationContacts(params.id)

  if (!organization || !user) {
    return <div>Organization not found</div>
  }

  return (
    <OrganizationLayout
      orgId={params.id}
      userProps={{
        id: user.id,
        picture: user.picture!,
        email: user.email,
        name: user.name
      }}
    >
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">
          Contacts for {organization.name}
        </h1>
        <ul className="space-y-2">
          {contacts.map(user => (
            <li key={user?.id} className="border p-2 rounded">
              <Link
                href={`/admin/organizations/${params.id}/contacts/${user?.id}`}
                className="text-blue-500 hover:underline"
              >
                {user?.name} ({user?.email})
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
    </OrganizationLayout>
  )
}
