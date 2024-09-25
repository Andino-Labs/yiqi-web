import { getOrganization } from "@/app/actions/organizationActions";

// You'll need to create an action to get contacts for an organization
import { getOrganizationContacts } from "@/app/actions/contactActions";
import Link from "next/link";

export default async function ContactsPage({
  params,
}: {
  params: { id: string };
}) {
  const organization = await getOrganization(params.id);
  const contacts = await getOrganizationContacts(params.id);

  if (!organization) {
    return <div>Organization not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Contact List for {organization.name}
      </h1>
      <ul className="space-y-2">
        {contacts.map((contact) => (
          <li key={contact.id} className="border p-2 rounded">
            {contact.name} - {contact.email}
          </li>
        ))}
      </ul>
      <Link
        href={`/organizations/${params.id}`}
        className="mt-4 inline-block text-blue-500 hover:underline"
      >
        Back to Organization Dashboard
      </Link>
    </div>
  );
}
