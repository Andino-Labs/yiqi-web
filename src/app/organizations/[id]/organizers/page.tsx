import { getOrganization } from "@/services/actions/organizationActions";
import { getOrganizersByOrganization } from "@/services/actions/organizerActions";
import Link from "next/link";
import AddOrganizerButton from "./AddOrganizerButton";

export default async function OrganizersPage({
  params,
}: {
  params: { id: string };
}) {
  const organization = await getOrganization(params.id);
  const organizers = await getOrganizersByOrganization(params.id);

  if (!organization) {
    return <div>Organization not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Manage Organizers for {organization.name}
      </h1>
      <ul className="space-y-2">
        {organizers.map((organizer) => (
          <li key={organizer.id} className="border p-2 rounded">
            {organizer.user.name} - {organizer.role}
          </li>
        ))}
      </ul>
      <AddOrganizerButton organizationId={params.id} />
      <Link
        href={`/organizations/${params.id}`}
        className="mt-4 inline-block text-blue-500 hover:underline"
      >
        Back to Organization Dashboard
      </Link>
    </div>
  );
}
