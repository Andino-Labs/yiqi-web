"use server";

import prisma from "@/lib/prisma";
import {
  sendUserWhatsappMessage,
  sendUserWhatsappMessageProps,
} from "@/lib/whatsapp";
import { getCurrentUser, isEventAdmin, isOrganizerAdmin } from "@/utils/auth";

// used for the initial load of threads
export async function getUserMessageThreads(
  userId: string,
  eventId?: string | undefined,
  orgId?: string | undefined
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

export async function sendUserWhatsappMessageAction(
  props: sendUserWhatsappMessageProps & { eventId?: string | undefined }
) {
  if (props.eventId) {
    const isAllowed = await isEventAdmin(props.eventId);

    if (!isAllowed) {
      throw "now allowed to see messages";
    }
  }

  const user = await getCurrentUser();

  return sendUserWhatsappMessage({ ...props, senderUserId: user?.id });
}
