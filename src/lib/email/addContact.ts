import { ClientRequest } from "@sendgrid/client/src/request";
import prisma from "../prisma";
import { apiClient } from "./client";

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
