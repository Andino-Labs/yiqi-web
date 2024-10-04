import { getOrganization } from "@/app/actions/organizationActions";
import Link from "next/link";

export default async function OrganizationDashboard({
  params,
}: {
  params: { id: string };
}) {
  const organization = await getOrganization(params.id);

  if (!organization) {
    return <div>Organization not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{organization.name} Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href={`/organizations/${params.id}/organizers`}
          className="p-4 bg-blue-100 rounded"
        >
          Manage Organizers
        </Link>
        <Link
          href={`/organizations/${params.id}/events`}
          className="p-4 bg-green-100 rounded"
        >
          Manage Events
        </Link>
        <Link
          href={`/organizations/${params.id}/contacts`}
          className="p-4 bg-yellow-100 rounded"
        >
          Contact List
        </Link>
      </div>
    </div>
  );
}
