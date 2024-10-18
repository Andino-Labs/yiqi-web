import { getOrganization } from "@/services/actions/organizationActions";
import {
  getEventAttendees,
  updateAttendeeStatus,
} from "@/services/actions/contactActions";
import Link from "next/link";
import { getEventDetails } from "@/services/actions/eventActions";

export default async function EventDetailsPage({
  params,
}: {
  params: { id: string; eventSlug: string };
}) {
  const organization = await getOrganization(params.id);

  const event = await getEventDetails(params.eventSlug);
  const attendees = await getEventAttendees(params.eventSlug);

  if (!organization || !event) {
    return <div>Event or Organization not found</div>;
  }

  async function handleApproval(
    attendeeId: string,
    status: "APPROVED" | "REJECTED",
  ) {
    "use server";
    await updateAttendeeStatus(attendeeId, status);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Event: {event.title}</h1>
      <p>Start: {new Date(event.startDate).toLocaleString()}</p>
      <p>End: {new Date(event.endDate).toLocaleString()}</p>
      <p>Description: {event.description}</p>
      <h2 className="text-xl font-bold mt-4 mb-2">Attendees:</h2>
      <ul className="space-y-2">
        {attendees.map((attendee) => (
          <li key={attendee.id} className="border p-2 rounded">
            <p>
              {attendee?.user?.name} ({attendee?.user?.email})
            </p>
            <p>Status: {attendee.status}</p>
            {attendee.customFields && (
              <pre>{JSON.stringify(attendee.customFields, null, 2)}</pre>
            )}
            {event.requiresApproval && attendee.status === "PENDING" && (
              <form>
                <button
                  formAction={() => handleApproval(attendee.id, "APPROVED")}
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                >
                  Approve
                </button>
                <button
                  formAction={() => handleApproval(attendee.id, "REJECTED")}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Reject
                </button>
              </form>
            )}
          </li>
        ))}
      </ul>
      <Link
        href={`/admin/organizations/${params.id}/events`}
        className="mt-4 inline-block text-blue-500 hover:underline"
      >
        Back to Events
      </Link>
    </div>
  );
}
