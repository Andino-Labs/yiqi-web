import { getAllOrganizations } from "../../services/actions/organizationActions";
import { isSuperAdmin } from "@/utils/auth";
import Link from "next/link";
import AddOrgButton from "./AddOrgButton";

export default async function OrganizationsPage() {
  const organizations = await getAllOrganizations();
  const isUserSuperAdmin = await isSuperAdmin();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Organizations</h1>
      <ul className="space-y-2">
        {organizations.map((org) => (
          <li key={org.id} className="border p-2 rounded">
            <Link
              href={`/organizations/${org.id}`}
              className="text-blue-500 hover:underline"
            >
              {org.name}
            </Link>
          </li>
        ))}
      </ul>
      {isUserSuperAdmin && <AddOrgButton />}
    </div>
  );
}
