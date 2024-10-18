"use server";

import prisma from "@/lib/prisma";

export default async function setupNewThreads(
  userId: string,
  organizationId: string,
) {
  // Check if email thread already exists for the user in the organization
  const emailThread = await prisma.messageThread.findFirst({
    where: {
      organizationId,
      contextUserId: userId,
      type: "email",
    },
  });

  // If email thread doesn't exist, create a new one
  if (!emailThread) {
    await prisma.messageThread.create({
      data: {
        organizationId,
        contextUserId: userId,
        type: "email",
      },
    });
  }

  // Check if WhatsApp thread already exists for the user in the organization
  const whatsappThread = await prisma.messageThread.findFirst({
    where: {
      organizationId,
      contextUserId: userId,
      type: "whatsapp",
    },
  });

  // If WhatsApp thread doesn't exist, create a new one
  if (!whatsappThread) {
    await prisma.messageThread.create({
      data: {
        organizationId,
        contextUserId: userId,
        type: "whatsapp",
      },
    });
  }
}
