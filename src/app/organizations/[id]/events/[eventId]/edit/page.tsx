import { getOrganization } from "@/app/actions/organizationActions";
import { updateEvent } from "@/app/actions/eventActions";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function EditEventPage({
  params,
}: {
  params: { id: string; eventId: string };
}) {
  const organization = await getOrganization(params.id);
  const event = await prisma.event.findUnique({
    where: { id: params.eventId },
  });
  const currentUser = await getCurrentUser();

  if (!organization || !event) {
    return <div>Organization or Event not found</div>;
  }

  const isAdmin =
    currentUser && (await isUserOrganizationAdmin(currentUser.id, params.id));

  if (!isAdmin) {
    return <div>Unauthorized</div>;
  }

  async function handleSubmit(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const description = formData.get("description") as string;

    await updateEvent(params.eventId, {
      title,
      startDate,
      endDate,
      description,
    });
    redirect(`/organizations/${params.id}/events`);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Event: {event.title}</h1>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={event.title}
            required
            className="w-full border p-2"
          />
        </div>
        <div>
          <label htmlFor="startDate" className="block">
            Start Date
          </label>
          <input
            type="datetime-local"
            id="startDate"
            name="startDate"
            defaultValue={event.startDate.toISOString().slice(0, 16)}
            required
            className="w-full border p-2"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block">
            End Date
          </label>
          <input
            type="datetime-local"
            id="endDate"
            name="endDate"
            defaultValue={event.endDate.toISOString().slice(0, 16)}
            required
            className="w-full border p-2"
          />
        </div>
        <div>
          <label htmlFor="description" className="block">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={event.description || ""}
            className="w-full border p-2"
            rows={4}
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Update Event
          </button>
          <Link
            href={`/organizations/${params.id}/events`}
            className="ml-4 text-blue-500 hover:underline"
          >
            Cancel
          </Link>
        </div>
      </form>
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
