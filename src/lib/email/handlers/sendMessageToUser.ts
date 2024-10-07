import prisma from "@/lib/prisma";
import {
  generateEmailPlainText,
  MailTemplatesIds,
  sendEmailForTemplate,
  TemplatePropsMap,
} from "../lib";

// Define the input type that enforces correct template-data pairing
export type SendEmailToUserType<T extends MailTemplatesIds> = {
  templateId: T;
  subject: string;
  dynamicTemplateData: TemplatePropsMap[T];
  destinationUserId: string;
  threadId: string;
  eventId: string;
  content?: string | undefined;
  attachement?: string;
  senderUserId?: string;
};

export async function sendEmailToUser<T extends MailTemplatesIds>({
  destinationUserId,
  threadId,
  content,
  attachement,
  senderUserId,
  ...sendMailInput
}: SendEmailToUserType<T>) {
  // get users whatsapp
  const thread = await prisma.messageThread.findFirstOrThrow({
    where: {
      id: threadId,
    },
    include: {
      contextUser: true,
      event: {
        include: {
          organization: {},
        },
      },
    },
  });
  // eventId

  const user = thread.contextUser;

  if (!user.email) {
    throw " user doesnt have an email";
  }

  await sendEmailForTemplate({
    ...sendMailInput,
    toEmail: user.email,
    threadId,
  });

  const textContent = await generateEmailPlainText({ ...sendMailInput });

  return prisma.message.create({
    data: {
      content: content || textContent,
      attachement,
      destinationUserId,
      messageThreadId: thread.id,
      senderUserId,
    },
  });
}
