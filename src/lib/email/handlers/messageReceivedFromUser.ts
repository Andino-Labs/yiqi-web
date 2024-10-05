import prisma from "@/lib/prisma";

export type SendEmailToUserType = {
  subject: string;
  threadId: string;
  content: string;
  attachement?: string;
};

export async function sendEmailToUser({
  threadId,
  content,
  attachement,
}: SendEmailToUserType) {
  // get users whatsapp
  const thread = await prisma.messageThread.findFirstOrThrow({
    where: {
      id: threadId,
    },
    include: {
      contextUser: true,
    },
  });
  // eventId

  const user = thread.contextUser;

  if (!user.email) {
    throw " user doesnt have an email";
  }

  return prisma.message.create({
    data: {
      content,
      attachement,
      messageThreadId: thread.id,
      senderUserId: user.id,
    },
  });
}
