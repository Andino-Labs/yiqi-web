import prisma from "@/lib/prisma";
import { z } from "zod";

const OrganizerRole = z.enum(["ADMIN", "VIEWER"]);

const OrganizerSchema = z.object({
  userId: z.string().cuid("Invalid user ID"),
  organizationId: z.string().cuid("Invalid organization ID"),
  role: OrganizerRole,
});

const UpdateOrganizerSchema = OrganizerSchema.partial();

export const organizerService = {
  create: async (data: z.infer<typeof OrganizerSchema>) => {
    const validatedData = OrganizerSchema.parse(data);
    return prisma.organizer.create({ data: validatedData });
  },

  getAll: async () => {
    return prisma.organizer.findMany({
      include: { user: true, organization: true },
    });
  },

  getById: async (id: string) => {
    return prisma.organizer.findUnique({
      where: { id },
      include: { user: true, organization: true },
    });
  },

  getByOrganizationId: async (organizationId: string) => {
    return prisma.organizer.findMany({
      where: { organizationId },
      include: { user: true },
    });
  },

  update: async (id: string, data: z.infer<typeof UpdateOrganizerSchema>) => {
    const validatedData = UpdateOrganizerSchema.parse(data);
    return prisma.organizer.update({ where: { id }, data: validatedData });
  },

  delete: async (id: string) => {
    return prisma.organizer.delete({ where: { id } });
  },

  isAdmin: async (userId: string, organizationId: string) => {
    const organizer = await prisma.organizer.findFirst({
      where: { userId, organizationId, role: "ADMIN" },
    });
    return !!organizer;
  },

  isViewer: async (userId: string, organizationId: string) => {
    const organizer = await prisma.organizer.findFirst({
      where: { userId, organizationId },
    });
    return !!organizer;
  },
};
