import sgMail from "@sendgrid/mail";
import sgClient from "@sendgrid/client";
import { ClientRequest } from "@sendgrid/client/src/request";
import { IOrganizationInviteTemplate } from "./template";
import prisma from "../prisma";

sgClient.setApiKey(process.env.SEND_GRID!);
sgMail.setApiKey(process.env.SEND_GRID!);
const FROM_EMAIL = process.env.FROM_EMAIL!;

if (!process.env.FROM_EMAIL) {
  throw "missing FROM_EMAIL in env";
}

if (!process.env.SEND_GRID) {
  throw "send grid api kkey missing";
}

const emailClient = sgMail;
const apiClient = sgClient;

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

export async function addContact(
  email: string,
  first_name = "unknown",
  last_name = "unknown"
) {
  const ownedStores = await prisma.user.findFirst({
    where: {
      email,
    },
    include: {
      organizers: {
        select: {
          id: true,
        },
      },
    },
  });
  const request: ClientRequest = {
    method: "PUT",
    url: "/v3/marketing/contacts",
    body: {
      contacts: [
        {
          email,
          first_name,
          last_name,
          ...((ownedStores?.organizers?.length || 0) > 0
            ? {
                custom_fields: {
                  organizer: ownedStores?.organizers?.length,
                },
              }
            : {}),
        },
      ],
    },
  };

  console.log(`adding ${email}`);
  await apiClient.request(request);
  console.log(`added ${email}`);
}
