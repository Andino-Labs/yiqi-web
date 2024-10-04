import { getServerSession } from "next-auth/next";
import prisma from "./prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/lib";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  if (!currentUser) {
    return null;
  }

  return {
    ...currentUser,
    id: currentUser.id.toString(),
  };
}
