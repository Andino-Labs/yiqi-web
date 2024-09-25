"use server";

import { organizerService } from "@/services/organizerService";
import { isSuperAdmin } from "@/utils/auth";
import { revalidatePath } from "next/cache";

export async function createOrganizer(
  data: Parameters<typeof organizerService.create>[0]
) {
  if (!(await isSuperAdmin())) throw new Error("Unauthorized");
  const organizer = await organizerService.create(data);
  revalidatePath("/organizers");
  return organizer;
}

export async function getAllOrganizers() {
  if (!(await isSuperAdmin())) throw new Error("Unauthorized");
  return organizerService.getAll();
}

export async function getOrganizer(id: string) {
  if (!(await isSuperAdmin())) throw new Error("Unauthorized");
  return organizerService.getById(id);
}

export async function updateOrganizer(
  id: string,
  data: Parameters<typeof organizerService.update>[1]
) {
  if (!(await isSuperAdmin())) throw new Error("Unauthorized");
  const organizer = await organizerService.update(id, data);
  revalidatePath("/organizers");
  return organizer;
}

export async function deleteOrganizer(id: string) {
  if (!(await isSuperAdmin())) throw new Error("Unauthorized");
  await organizerService.delete(id);
  revalidatePath("/organizers");
}
