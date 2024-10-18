import axios from "axios";
import prisma from "./prisma";
import createMessageRecord from "./communications/createMessageRecord";

export type sendUserWhatsappMessageProps = {
  destinationUserId: string;
  threadId: string;
  content: string;
  attachement?: string;
  senderUserId?: string | null;
};

export async function sendUserWhatsappMessage({
  destinationUserId,
  threadId,
  content,
  attachement,
  senderUserId,
}: sendUserWhatsappMessageProps) {
  // get users whatsapp
  const thread = await prisma.messageThread.findFirstOrThrow({
    where: {
      id: threadId,
    },
    include: {
      contextUser: true,
      organization: {
        include: {
          integration: {
            include: {
              whatsappIntegration: true,
            },
          },
        },
      },
    },
  });
  // eventId

  const org = thread.organization;

  if (!org) {
    throw "no org found for this thread";
  }

  const user = thread.contextUser;
  const WhatsappIntegration = await prisma.whatsappIntegration.findFirstOrThrow(
    {
      where: {
        integration: {
          organizationId: org.id,
        },
      },
    },
  );
  await axios({
    method: "POST",
    url: `https://graph.facebook.com/v18.0/${WhatsappIntegration.businessAccountId}/messages`,
    headers: {
      Authorization: `Bearer ${WhatsappIntegration.verifyToken}`,
    },
    data: {
      messaging_product: "whatsapp",
      to: user?.phoneNumber,
      text: { body: content },
      image: {
        link: attachement,
        caption: content, // Optional caption for the image
      },
    },
  });

  return createMessageRecord({
    content,
    attachement,
    destinationUserId,
    messageThreadId: thread.id,
    senderUserId,
  });
}
