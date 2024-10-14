import { sendEmail } from "./client";
import { render } from "@react-email/render";
import { ComponentType } from "react";
import {
  OrgInviteTemplate,
  OrgInviteTemplateProps,
} from "./templates/OrgInvite";
import {
  ReservationPaymentReminder,
  ReservationPaymentReminderProps,
} from "./templates/ReservationPaymentReminder";
import {
  EventAttendanceConfirmed,
  EventAttendanceConfirmedProps,
} from "./templates/ReservationConfirmed";
import {
  EventRegistrationRejected,
  EventRegistrationRejectedProps,
} from "./templates/ReservationRejected";
import {
  ReservationReminder,
  ReservationReminderProps,
} from "./templates/ReservationReminder";

// Enum for template IDs
export enum MailTemplatesIds {
  ORG_INVITE = "ORG_INVITE",
  RESERVATION_PAYMENT_REMINDER = "RESERVATION_PAYMENT_REMINDER",
  RESERVATION_CONFIRMED = "RESERVATION_CONFIRMED",
  RESERVATION_REJECTED = "RESERVATION_REJECTED",
  RESERVATION_REMINDER = "RESERVATION_REMINDER",
  // Add more templates as needed
}

// Mapping type that links template IDs to their corresponding props
export interface TemplatePropsMap {
  [MailTemplatesIds.ORG_INVITE]: OrgInviteTemplateProps;
  [MailTemplatesIds.RESERVATION_PAYMENT_REMINDER]: ReservationPaymentReminderProps;
  [MailTemplatesIds.RESERVATION_CONFIRMED]: EventAttendanceConfirmedProps;
  [MailTemplatesIds.RESERVATION_REJECTED]: EventRegistrationRejectedProps;
  [MailTemplatesIds.RESERVATION_REMINDER]: ReservationReminderProps;
  // Add other template mappings as needed
}

// Strongly typed map linking templates to their corresponding components
export const MailTemplateMap: {
  [K in keyof TemplatePropsMap]: ComponentType<TemplatePropsMap[K]>;
} = {
  [MailTemplatesIds.ORG_INVITE]: OrgInviteTemplate,
  [MailTemplatesIds.RESERVATION_PAYMENT_REMINDER]: ReservationPaymentReminder,
  [MailTemplatesIds.RESERVATION_CONFIRMED]: EventAttendanceConfirmed,
  [MailTemplatesIds.RESERVATION_REJECTED]: EventRegistrationRejected,
  [MailTemplatesIds.RESERVATION_REMINDER]: ReservationReminder,
  // Add other templates as needed
};

// Define the input type that enforces correct template-data pairing
export type SendMailInput<T extends MailTemplatesIds> = {
  toEmail: string;
  templateId: T;
  subject: string;
  dynamicTemplateData: TemplatePropsMap[T];
  threadId: string; // Dynamic props mapped based on template ID
};

// Define the input type that enforces correct template-data pairing
export type GenerateEmailPlainText<T extends MailTemplatesIds> = {
  templateId: T;
  dynamicTemplateData: TemplatePropsMap[T]; // Dynamic props mapped based on template ID
};

// The sendEmail function, now strongly typed for templateId and dynamic data
export async function sendEmailForTemplate<T extends MailTemplatesIds>({
  toEmail,
  subject,
  templateId,
  dynamicTemplateData,
  threadId,
}: SendMailInput<T>) {
  const Component = MailTemplateMap[templateId];

  // type Safety established at the top level
  const renderedBody = await render(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Component {...(dynamicTemplateData as any)} />
  );

  // Use your email client to send the email
  return await sendEmail(toEmail, subject, renderedBody, threadId);
}

// The sendEmail function, now strongly typed for templateId and dynamic data
export async function generateEmailPlainText<T extends MailTemplatesIds>({
  templateId,
  dynamicTemplateData,
}: GenerateEmailPlainText<T>) {
  const Component = MailTemplateMap[templateId];

  // type Safety established at the top level
  return await render(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Component {...(dynamicTemplateData as any)} />
  );
}