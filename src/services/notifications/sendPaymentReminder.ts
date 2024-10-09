import { sendEmailToUser } from "@/lib/email/handlers/sendMessageToUser";
import { MailTemplatesIds } from "@/lib/email/lib";
import prisma from "@/lib/prisma";
import { sendUserWhatsappMessage } from "@/lib/whatsapp";
import { Event, Organization } from "@prisma/client";
import { User } from "next-auth";

export default async function sendPaymentReminder(
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
