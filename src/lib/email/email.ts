import { emailClient, FROM_EMAIL } from "./client";
import { IOrganizationInviteTemplate } from "./template";

export enum MailTemplatesIds {
  ORG_INVITE = "d-cdcf4b50b8d749cc899893bcbe307792",
  // Add more templates as needed.
}

// Add a type for mapping templates to dynamic data.
type MailTemplateData = {
  [MailTemplatesIds.ORG_INVITE]: IOrganizationInviteTemplate;
  // Map other templates to their data types here.
};

// Define the send mail input type that enforces correct template-data pairing.
type SendMailInput<T extends MailTemplatesIds> = {
  toEmail: string;
  templateId: T;
  subject: string;
  dynamicTemplateData: MailTemplateData[T];
};

// The sendEmail function, now strongly typed for templateId and dynamic data.
export async function sendEmail<T extends MailTemplatesIds>({
  toEmail,
  templateId,
  dynamicTemplateData,
}: SendMailInput<T>) {
  await emailClient.send({
    to: toEmail,
    from: { email: FROM_EMAIL },
    templateId: templateId,
    dynamicTemplateData,
  });
}
