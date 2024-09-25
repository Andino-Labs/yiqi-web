import {
  getAllOrganizations,
  createOrganization,
} from "../actions/organizationActions";

export default async function OrganizationsPage() {
  const organizations = await getAllOrganizations();

  async function handleCreateOrganization(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const logo = formData.get("logo") as string;
    await createOrganization({ name, description, logo });
  }

  return (
    <div>
      <h1>Organizations</h1>
      <ul>
        {organizations.map((org) => (
          <li key={org.id}>{org.name}</li>
        ))}
      </ul>
      <form action={handleCreateOrganization}>
        <input name="name" placeholder="Organization Name" required />
        <input name="description" placeholder="Description" />
        <input name="logo" placeholder="Logo URL" />
        <button type="submit">Create Organization</button>
      </form>
    </div>
  );
}
