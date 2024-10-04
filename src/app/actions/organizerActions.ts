"use server";

import prisma from "@/lib/prisma";
import { OrganizerSchema } from "@/schemas/organizerSchema";

export async function createOrganizer(data: unknown) {
  const validatedData = OrganizerSchema.parse(data);
  return await prisma.organizer.create({ data: validatedData });
}

export async function updateOrganizer(id: string, data: unknown) {
  const validatedData = OrganizerSchema.parse(data);
  return await prisma.organizer.update({
    where: { id },
    data: validatedData,
  });
}

export async function deleteOrganizer(id: string) {
  return await prisma.organizer.delete({ where: { id } });
}

export async function getOrganizer(id: string) {
  return await prisma.organizer.findUnique({ where: { id } });
}

export async function getOrganizersByOrganization(organizationId: string) {
  return await prisma.organizer.findMany({
    where: { organizationId },
    include: { user: true },
  });
}
