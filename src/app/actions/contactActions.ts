import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function getOrganizationContacts(organizationId: string) {
  const contacts = await prisma.attendee.findMany({
    where: {
      event: { organizationId },
    },
    include: {
      user: true,
      event: true,
    },
    distinct: ["userId"],
  });

  return contacts;
}

export async function getContactDetails(
  userId: string,
  organizationId: string
) {
  const contact = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      attendedEvents: {
        where: { event: { organizationId } },
        include: { event: true },
      },
    },
  });

  return contact;
}

export async function getEventAttendees(eventId: string) {
  const attendees = await prisma.attendee.findMany({
    where: { eventId },
    include: { user: true },
  });

  return attendees;
}

export async function updateAttendeeStatus(
  attendeeId: string,
  status: "APPROVED" | "REJECTED"
) {
  const currentUser = await getCurrentUser();
  const attendee = await prisma.attendee.findUnique({
    where: { id: attendeeId },
    include: { event: true },
  });

  if (!attendee) throw new Error("Attendee not found");

  if (
    !currentUser ||
    !(await isUserOrganizationAdmin(
      currentUser.id,
      attendee.event.organizationId
    ))
  ) {
    throw new Error("Unauthorized");
  }

  const updatedAttendee = await prisma.attendee.update({
    where: { id: attendeeId },
    data: { status },
  });

  return updatedAttendee;
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
