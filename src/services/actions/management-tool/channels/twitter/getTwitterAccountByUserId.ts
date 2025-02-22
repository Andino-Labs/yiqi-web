'use server'

import prisma from "@/lib/prisma";
import { dataTwitterSchema } from "@/schemas/twitterSchema";

export const getTwitterAccountByUserId = async (userId: string) => {
  try {
    const twitterAccount = await prisma.twitterAccount.findFirst({
      where: {
        userId: userId,
      },
    });

    if (!twitterAccount) {
      return dataTwitterSchema.parse({ success: false });
    }

    return dataTwitterSchema.parse(twitterAccount);
  } catch (error) {
    console.error("Error fetching Twitter account:", error)
    return null
  }
};
