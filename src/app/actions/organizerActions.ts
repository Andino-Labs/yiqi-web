"use server";

import { organizerService } from "@/services/organizerService";
import { isSuperAdmin, isOrganizerAdmin } from "@/utils/auth";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { z } from "zod";

export const OrganizerSchema = z.object({
  userId: z.string().cuid("Invalid user ID"),
  organizationId: z.string().cuid("Invalid organization ID"),
  role: z.enum(["ADMIN", "VIEWER"]),
});

export async function createOrganizer(data: z.infer<typeof OrganizerSchema>) {
  const session = await getServerSession();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) throw new Error("User not found");

  if (
    (await isSuperAdmin()) ||
    (await isOrganizerAdmin(user.id, data.organizationId))
  ) {
    const organizer = await organizerService.create(data);
    revalidatePath(`/organizations/${data.organizationId}/organizers`);
    return organizer;
  } else {
    throw new Error("Unauthorized");
  }
}

export async function getOrganizersForOrganization(organizationId: string) {
  const session = await getServerSession();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) throw new Error("User not found");

  if (
    (await isSuperAdmin()) ||
    (await isOrganizerAdmin(user.id, organizationId))
  ) {
    return organizerService.getByOrganizationId(organizationId);
  } else {
    throw new Error("Unauthorized");
  }
}

export async function updateOrganizer(
  id: string,
  data: Partial<z.infer<typeof OrganizerSchema>>
) {
  const session = await getServerSession();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) throw new Error("User not found");

  const organizer = await organizerService.getById(id);
  if (!organizer) throw new Error("Organizer not found");

  if (
    (await isSuperAdmin()) ||
    (await isOrganizerAdmin(user.id, organizer.organizationId))
  ) {
    const updatedOrganizer = await organizerService.update(id, data);
    revalidatePath(`/organizations/${organizer.organizationId}/organizers`);
    return updatedOrganizer;
  } else {
    throw new Error("Unauthorized");
  }
}

export async function deleteOrganizer(id: string) {
  const session = await getServerSession();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) throw new Error("User not found");

  const organizer = await organizerService.getById(id);
  if (!organizer) throw new Error("Organizer not found");

  if (
    (await isSuperAdmin()) ||
    (await isOrganizerAdmin(user.id, organizer.organizationId))
  ) {
    await organizerService.delete(id);
    revalidatePath(`/organizations/${organizer.organizationId}/organizers`);
  } else {
    throw new Error("Unauthorized");
  }
}
