import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Zod schema for event data
const EventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid start date",
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid end date",
  }),
  description: z.string().optional(),
});

export async function getOrganizationEvents(organizationId: string) {
  return await prisma.event.findMany({
    where: { organizationId },
    orderBy: { startDate: "asc" },
  });
}

export async function createEvent(organizationId: string, eventData: unknown) {
  const currentUser = await getCurrentUser();
  if (
    !currentUser ||
    !(await isUserOrganizationAdmin(currentUser.id, organizationId))
  ) {
    throw new Error("Unauthorized");
  }

  // Validate event data
  const validatedData = EventSchema.parse(eventData);

  const event = await prisma.event.create({
    data: {
      ...validatedData,
      organizationId,
    },
  });

  revalidatePath(`/organizations/${organizationId}/events`);
  return event;
}

export async function updateEvent(eventId: string, eventData: unknown) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw new Error("Event not found");

  const currentUser = await getCurrentUser();
  if (
    !currentUser ||
    !(await isUserOrganizationAdmin(currentUser.id, event.organizationId))
  ) {
    throw new Error("Unauthorized");
  }

  // Validate event data
  const validatedData = EventSchema.parse(eventData);

  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: validatedData,
  });

  revalidatePath(`/organizations/${event.organizationId}/events`);
  return updatedEvent;
}

export async function deleteEvent(eventId: string) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw new Error("Event not found");

  const currentUser = await getCurrentUser();
  if (
    !currentUser ||
    !(await isUserOrganizationAdmin(currentUser.id, event.organizationId))
  ) {
    throw new Error("Unauthorized");
  }

  await prisma.event.delete({ where: { id: eventId } });

  revalidatePath(`/organizations/${event.organizationId}/events`);
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
