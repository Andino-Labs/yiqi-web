"use server";

import prisma from "@/lib/prisma";
import {
  sendUserEventWhatsappMessage,
  sendUserEventWhatsappMessageProps,
} from "@/lib/whatsapp";
import { isEventAdmin, isOrganizerAdmin } from "@/utils/auth";

// used for the initial load of threads
export async function getUserMessageThreads(
  userId: string,
  eventId?: string | undefined,
  orgId?: string | undefined,
) {
  let isAllowed = false;
  if (eventId) {
    isAllowed = await isEventAdmin(eventId);
  } else if (orgId) {
    isAllowed = await isOrganizerAdmin(orgId);
  }
  if (!isAllowed) {
    throw "no event or org";
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

export async function sendUserEventWhatsappMessageAction(
  props: sendUserEventWhatsappMessageProps,
) {
  if (props.eventId) {
    const isAllowed = await isEventAdmin(props.eventId);

    if (!isAllowed) {
      throw "now allowed to see messages";
    }
  }

  return sendUserEventWhatsappMessage(props);
}
