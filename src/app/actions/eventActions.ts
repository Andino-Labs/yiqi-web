"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser, isOrganizerAdmin } from "@/utils/auth";
import { revalidatePath } from "next/cache";
import { EventSchema, EventInput } from "@/schemas/eventSchema";

export async function getOrganizationEvents(organizationId: string) {
  return await prisma.event.findMany({
    where: { organizationId },
    orderBy: { startDate: "asc" },
  });
}

export async function createEvent(organizationId: string, eventData: unknown) {
  const currentUser = await getCurrentUser();
  if (!currentUser || !(await isOrganizerAdmin(organizationId))) {
    throw new Error("Unauthorized");
  }

  // Validate event data
  const validatedData = EventSchema.parse(eventData) as EventInput;

  // Convert date strings to Date objects
  const startDate = new Date(validatedData.startDate);
  const endDate = new Date(validatedData.endDate);

  const event = await prisma.event.create({
    data: {
      ...validatedData,
      startDate,
      endDate,
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
  if (!currentUser || !(await isOrganizerAdmin(event.organizationId))) {
    throw new Error("Unauthorized");
  }

  // Validate event data
  const validatedData = EventSchema.parse(eventData) as EventInput;

  // Convert date strings to Date objects
  const startDate = new Date(validatedData.startDate);
  const endDate = new Date(validatedData.endDate);

  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: {
      ...validatedData,
      startDate,
      endDate,
    },
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
