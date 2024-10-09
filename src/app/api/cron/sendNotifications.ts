// pages/api/checkUnpaidUsers.ts

import { sendEmailToUser } from "@/lib/email/handlers/sendMessageToUser";
import { MailTemplatesIds } from "@/lib/email/lib";
import prisma from "@/lib/prisma";
import { sendUserWhatsappMessage } from "@/lib/whatsapp";
import { Event, Organization, User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Find notifications that need to be sent
  const notificationsToSend = await prisma.notification.findMany({
    where: {
      scheduledFor: {
        lte: new Date(),
      },
      sentAt: null,
      eventId: {
        not: null,
      },
      user: {
        stopCommunication: false,
      },
    },
    include: {
      user: true,
      event: true,
      organization: true,
    },
    take: 20,
  });

  // Send the reminders
  for (const notification of notificationsToSend) {
    if (notification.event) {
      if (notification.type == "PAYMENT_REQUIRED_REMINDER") {
        await sendPaymentReminder(
          notification.user,
          notification.event,
          notification.organization
        );
      }
    }

    // Mark the notification as sent
    await prisma.notification.update({
      where: { id: notification.id },
      data: { sentAt: new Date() },
    });
  }

  res.status(200).json({ message: "Reminders sent" });
}

async function sendPaymentReminder(
  user: User,
  event: Event,
  org: Organization
) {
  // TODO: send the messages and template stuff
  // send both the whatsapp and the email here, also include the initial
  // const message = `Reminder for ${user.name}: Event "${event.title}" starts on ${event.startDate}`;

  const threads = await prisma.messageThread.findMany({
    where: {
      organizationId: org.id,
      contextUserId: user.id,
    },
  });

  const results = threads.map(async (thread) => {
    const threadType = thread.type;

    if (threadType === "email") {
      sendEmailToUser({
        destinationUserId: user.id,
        threadId: thread.id,
        // todo modify the type for the one u need.
        dynamicTemplateData: { inviteLink: "", name: "" },
        eventId: event.id,
        subject: "You can still get your tickets.",
        // TODO change this to something meaninfull like payment reminder
        templateId: MailTemplatesIds.ORG_INVITE,
      });
    }
    if (threadType === "whatsapp") {
      return sendUserWhatsappMessage({
        destinationUserId: user.id,
        threadId: thread.id,
        content: "",
      });
    }
  });
  await Promise.allSettled(results);
}
