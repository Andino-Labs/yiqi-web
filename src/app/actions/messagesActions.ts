"use server";

import prisma from "@/lib/prisma";
import { isEventAdmin, isOrganizerAdmin } from "@/utils/auth";

// used for the initial load of threads
export async function getUserMessageThreads(
  userId: string,
  eventId?: string | undefined
) {
  if (eventId) {
    const isAllowed = await isEventAdmin(eventId);

    if (!isAllowed) {
      throw "now allowed to see messages";
    }
  } else {
    const isAllowed = isOrganizerAdmin(userId);

    if (!isAllowed) {
      throw "now allowed to see messages";
    }
  }

  const messageThreads = await prisma.messageThread.findMany({
    where: {
      contextUserId: userId,
      ...(eventId ? { eventId } : {}),
    },
    include: {
      messages: {
        take: 100,
      },
    },
  });

  return messageThreads;
}
