"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser, isOrganizerAdmin } from "@/utils/auth";
import { revalidatePath } from "next/cache";
import {
  EventSchema,
  EventInput,
  createAttendeeSchema,
  DbEventSchema,
} from "@/schemas/eventSchema";
import { z } from "zod";

type DbEvent = z.infer<typeof DbEventSchema>;

export async function getOrganizationEvents(
  organizationId: string
): Promise<DbEvent[]> {
  const events = await prisma.event.findMany({
    where: { organizationId },
    orderBy: { startDate: "asc" },
  });

  return events.map((event) => DbEventSchema.parse(event));
}

export async function getEvent(eventId: string): Promise<DbEvent | null> {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  return event ? DbEventSchema.parse(event) : null;
}

export async function createEvent(organizationId: string, eventData: unknown) {
  const currentUser = await getCurrentUser();
  if (!currentUser || !(await isOrganizerAdmin(organizationId))) {
    throw new Error("Unauthorized");
  }

  const validatedData = EventSchema.parse(eventData) as EventInput;

  const event = await prisma.event.create({
    data: {
      ...validatedData,
      organizationId,
    },
  });

  revalidatePath(`/organizations/${organizationId}/events`);
  return DbEventSchema.parse(event);
}

export async function updateEvent(eventId: string, eventData: unknown) {
  const event = await getEvent(eventId);
  if (!event) throw new Error("Event not found");

  const currentUser = await getCurrentUser();
  if (!currentUser || !(await isOrganizerAdmin(event.organizationId))) {
    throw new Error("Unauthorized");
  }

  const validatedData = EventSchema.parse(eventData) as EventInput;

  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: validatedData,
  });

  revalidatePath(`/organizations/${event.organizationId}/events`);
  return DbEventSchema.parse(updatedEvent);
}

export async function deleteEvent(eventId: string) {
  const event = await getEvent(eventId);
  if (!event) throw new Error("Event not found");

  const currentUser = await getCurrentUser();
  if (!currentUser || !(await isOrganizerAdmin(event.organizationId))) {
    throw new Error("Unauthorized");
  }

  await prisma.event.delete({ where: { id: eventId } });

  revalidatePath(`/organizations/${event.organizationId}/events`);
}

export async function createAttendee(
  eventId: string,
  attendeeData: Record<string, unknown>
) {
  const event = await getEvent(eventId);
  if (!event) throw new Error("Event not found");

  const attendeeSchema = createAttendeeSchema(event.customFields);
  const validatedData = attendeeSchema.parse(attendeeData);

  let user = await prisma.user.findUnique({
    where: { email: validatedData.email },
  });

  if (!user) {
    // Create a new user if they don't exist
    user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name || validatedData.email.split("@")[0], // Use part of email as name if not provided
      },
    });
  }

  const attendee = await prisma.attendee.create({
    data: {
      userId: user.id,
      eventId: event.id,
      status: event.requiresApproval ? "PENDING" : "APPROVED",
      customFields: validatedData,
    },
  });

  return attendee;
}

export async function getPublicEvents(): Promise<DbEvent[]> {
  const now = new Date();
  const events = await prisma.event.findMany({
    where: {
      endDate: { gte: now },
      // Add any other conditions for public events (e.g., isPublic: true)
    },
    orderBy: { startDate: "asc" },
  });

  return events.map((event) => DbEventSchema.parse(event));
}
