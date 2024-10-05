"use server";

import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/lib";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  return user;
}

export async function isSuperAdmin() {
  const user = await getCurrentUser();
  return user?.isSuperAdmin ?? false;
}

export async function isOrganizerAdmin(organizationId: string) {
  const user = await getCurrentUser();
  if (!user) return false;

  const organizer = await prisma.organizer.findFirst({
    where: {
      userId: user.id,
      organizationId,
      role: "ADMIN",
    },
  });

  return !!organizer;
}

export async function isEventAdmin(eventId: string) {
  const event = await prisma.event.findFirstOrThrow({
    where: {
      id: eventId,
    },
  });

  return isOrganizerAdmin(event.organizationId);
}
