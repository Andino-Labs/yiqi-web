import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { cookies, headers } from "next/headers";
import prisma from "../prisma";
import { OrganizerRole } from "@prisma/client";
import { Google } from "arctic";

export const googleOAuthClient = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.NEXT_PUBLIC_URL + "/api/auth/google/callback",
);

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "andino-auth-cookie",
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

export const getUser = async () => {
  // Check for bearer token first
  const authHeader = headers().get("authorization");
  let sessionId: string | null = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    sessionId = authHeader.split(" ")[1];
  } else {
    // If no bearer token, check for session cookie
    sessionId = cookies().get(lucia.sessionCookieName)?.value || null;
  }

  if (!sessionId) {
    return null;
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (!user || !session) {
    return null;
  }

  try {
    if (session && session.fresh) {
      const sessionCookie = await lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    if (!session) {
      const sessionCookie = await lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch (error) {
    console.error(error);
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user?.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      picture: true,
      role: true,
    },
  });

  return dbUser;
};

export async function isEventAdmin(
  eventId: string,
  userId: string,
): Promise<boolean> {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      organization: {
        include: {
          organizers: {
            where: {
              userId: userId,
              role: OrganizerRole.ADMIN,
            },
          },
        },
      },
    },
  });

  if (event && event.organization && event.organization.organizers) {
    return event.organization.organizers.length > 0;
  }
  return false;
}

export async function isOrganizerAdmin(
  orgId: string,
  userId: string,
): Promise<boolean> {
  const organizer = await prisma.organizer.findFirst({
    where: {
      organizationId: orgId,
      userId: userId,
      role: OrganizerRole.ADMIN,
    },
  });

  return organizer !== null;
}
