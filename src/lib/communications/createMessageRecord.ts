import prisma from "../prisma";

export default async function createMessageRecord(data: {
  content: string;
  attachement?: string | undefined;
  destinationUserId?: string | undefined | null;
  messageThreadId: string;
  senderUserId?: string | undefined | null;
}) {
  const message = await prisma.message.create({ data });
  await prisma.messageThread.update({
    where: { id: data.messageThreadId },
    data: { updatedAt: new Date() },
  });
  return message;
}
