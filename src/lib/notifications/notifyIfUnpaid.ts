// import { sendEmailForTemplate } from "../email/lib";
// import prisma from "../prisma";

export default async function notifyIfUnpaid() {
  // const unpaidRegistrations = await prisma.eventRegistration.findMany({
  //   where: {
  //     paid: false,
  //   },
  //   include: {
  //     event: {
  //       include: {
  //         messageThread: {
  //           include: { contextUser: true },
  //         },
  //       },
  //     },
  //   },
  // });
  // const emailsToSend = sendEmailForTemplate({});
}
