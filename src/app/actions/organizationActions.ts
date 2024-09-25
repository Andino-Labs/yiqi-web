"use server";

import { organizationService } from "@/services/organizationService";
import {
  isSuperAdmin,
  isOrganizerAdmin,
  isOrganizerViewer,
} from "@/utils/auth";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";

export async function createOrganization(
  data: Parameters<typeof organizationService.create>[0]
) {
  if (!(await isSuperAdmin())) throw new Error("Unauthorized");
  const org = await organizationService.create(data);
  revalidatePath("/organizations");
  return org;
}

export async function getAllOrganizations() {
  return organizationService.getAll();
}

export async function getOrganization(id: string) {
  const session = await getServerSession();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) throw new Error("User not found");

  if ((await isSuperAdmin()) || (await isOrganizerViewer(user.id, id))) {
    return organizationService.getById(id);
  } else {
    throw new Error("Unauthorized");
  }
}

export async function updateOrganization(
  id: string,
  data: Parameters<typeof organizationService.update>[1]
) {
  const session = await getServerSession();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) throw new Error("User not found");

  if ((await isSuperAdmin()) || (await isOrganizerAdmin(user.id, id))) {
    const org = await organizationService.update(id, data, user.id);
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
