import axios from "axios";
import prisma from "./prisma";

export type sendUserEventWhatsappMessageProps = {
  destinationUserId: string;
  threadId: string;
  eventId: string;
  content: string;
  attachement?: string;
  senderUserId?: string;
};
export async function sendUserEventWhatsappMessage({
  destinationUserId,
  threadId,
  eventId,
  content,
  attachement,
  senderUserId,
}: sendUserEventWhatsappMessageProps) {
  // get users whatsapp
  const thread = await prisma.messageThread.findFirstOrThrow({
    where: {
      id: threadId,
      eventId,
    },
    include: {
      event: {
        include: {
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
      },
    },
  });
  // eventId

  const event = thread.event;
  const org = event.organization;

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
      to: WhatsappIntegration.phoneNumber,
      text: { body: content },
      image: {
        link: attachement,
        caption: content, // Optional caption for the image
      },
    },
  });

  return prisma.message.create({
    data: {
      content,
      attachement,
      destinationUserId,
      messageThreadId: thread.id,
      senderUserId,
    },
  });
}
