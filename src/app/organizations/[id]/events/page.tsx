import { getOrganization } from "@/app/actions/organizationActions";
import { getOrganizationEvents } from "@/app/actions/eventActions";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function EventsPage({
  params,
}: {
  params: { id: string };
}) {
  const organization = await getOrganization(params.id);
  const events = await getOrganizationEvents(params.id);
  const currentUser = await getCurrentUser();

  if (!organization) {
    return <div>Organization not found</div>;
  }

  const isAdmin =
    currentUser && (await isUserOrganizationAdmin(currentUser.id, params.id));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Events for {organization.name}
      </h1>
      <ul className="space-y-2">
        {events.map((event) => (
          <li
            key={event.id}
            className="border p-2 rounded flex justify-between items-center"
          >
            <div>
              <Link
                href={`/organizations/${params.id}/events/${event.id}`}
                className="text-blue-500 hover:underline"
              >
                {event.title}
              </Link>
              <p>
                {new Date(event.startDate).toLocaleString()} -{" "}
                {new Date(event.endDate).toLocaleString()}
              </p>
            </div>
            {isAdmin && (
              <Link
                href={`/organizations/${params.id}/events/${event.id}/edit`}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </Link>
            )}
          </li>
        ))}
      </ul>
      {isAdmin && (
        <Link
          href={`/organizations/${params.id}/events/create`}
          className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded"
        >
          Create New Event
        </Link>
      )}
      <Link
        href={`/organizations/${params.id}`}
        className="mt-4 ml-4 inline-block text-blue-500 hover:underline"
      >
        Back to Organization Dashboard
      </Link>
    </div>
  );
}

async function isUserOrganizationAdmin(userId: string, organizationId: string) {
  const membership = await prisma.organizer.findFirst({
    where: {
      userId,
      organizationId,
      role: "ADMIN",
    },
  });
  return !!membership;
}
