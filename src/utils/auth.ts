"use server";

import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";

export async function isSuperAdmin() {
  const session = await getServerSession();
  if (!session?.user?.email) return false;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { isSuperAdmin: true },
  });

  return user?.isSuperAdmin ?? false;
}

export async function isOrganizerAdmin(userId: string, organizationId: string) {
  const organizer = await prisma.organizer.findFirst({
    where: { userId, organizationId, role: "ADMIN" },
  });

  return !!organizer;
}

export async function isOrganizerViewer(
  userId: string,
  organizationId: string
) {
  const organizer = await prisma.organizer.findFirst({
    where: { userId, organizationId },
  });

  return !!organizer;
}
