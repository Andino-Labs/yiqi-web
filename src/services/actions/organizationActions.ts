"use server";

import { organizationService } from "@/services/organizationService";
import { getCurrentUser, isSuperAdmin, isOrganizerAdmin } from "@/utils/auth";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function createOrganization(
  data: Parameters<typeof organizationService.create>[0],
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Unauthorized");

  if (!(await isSuperAdmin())) throw new Error("Unauthorized");

  const org = await organizationService.create(data);

  // Create an organizer entry for the current user as an admin
  await prisma.organizer.create({
    data: {
      userId: currentUser.id,
      organizationId: org.id,
      role: "ADMIN",
    },
  });

  revalidatePath("/organizations");
  return org;
}

export async function getAllOrganizations() {
  return organizationService.getAll();
}

export async function getOrganization(id: string) {
  return await prisma.organization.findUnique({
    where: { id },
  });
}

export async function updateOrganization(
  id: string,
  data: Parameters<typeof organizationService.update>[1],
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Unauthorized");

  if ((await isSuperAdmin()) || (await isOrganizerAdmin(id))) {
    const org = await organizationService.update(id, data, currentUser.id);
    revalidatePath("/organizations");
    return org;
  } else {
    throw new Error("Unauthorized");
  }
}

export async function deleteOrganization(id: string) {
  if (!(await isSuperAdmin())) throw new Error("Unauthorized");
  await organizationService.delete(id);
  revalidatePath("/organizations");
}
