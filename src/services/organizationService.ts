import prisma from "@/lib/prisma";
import { z } from "zod";

const OrganizationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  logo: z.string().url("Invalid URL").optional(),
});

const UpdateOrganizationSchema = OrganizationSchema.partial();

export const organizationService = {
  create: async (data: z.infer<typeof OrganizationSchema>) => {
    const validatedData = OrganizationSchema.parse(data);
    return prisma.organization.create({ data: validatedData });
  },

  getAll: async () => {
    return prisma.organization.findMany();
  },

  getById: async (id: string) => {
    return prisma.organization.findUnique({ where: { id } });
  },

  update: async (
    id: string,
    data: z.infer<typeof UpdateOrganizationSchema>,
    userId: string,
  ) => {
    const validatedData = UpdateOrganizationSchema.parse(data);

    const organizer = await prisma.organizer.findFirst({
      where: { organizationId: id, userId: userId },
    });

    if (!organizer) {
      throw new Error(
        "Unauthorized: User is not an organizer for this organization",
      );
    }

    return prisma.organization.update({ where: { id }, data: validatedData });
  },

  delete: async (id: string) => {
    return prisma.organization.delete({ where: { id } });
  },
};
