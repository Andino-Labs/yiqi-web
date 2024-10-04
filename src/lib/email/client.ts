import sgMail from "@sendgrid/mail";
import sgClient from "@sendgrid/client";
sgClient.setApiKey(process.env.SEND_GRID!);
sgMail.setApiKey(process.env.SEND_GRID!);
export const FROM_EMAIL = process.env.FROM_EMAIL!;

if (!process.env.FROM_EMAIL) {
  throw "missing FROM_EMAIL in env";
}

if (!process.env.SEND_GRID) {
  throw "send grid api kkey missing";
}

export const emailClient = sgMail;
export const apiClient = sgClient;
