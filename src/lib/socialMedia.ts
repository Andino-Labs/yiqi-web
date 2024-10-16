import prisma from "@/lib/prisma";
import { SocialMediaPlatform } from "@prisma/client";

export async function connectSocialMediaAccount(data: {
  organizationId: string;
  platform: SocialMediaPlatform;
  accountId: string;
  accountName: string;
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date | null;
  scope: string[];
}) {
  return prisma.socialMediaAccount.create({
    data,
  });
}

export async function getSocialMediaAccounts(organizationId: string) {
  return prisma.socialMediaAccount.findMany({
    where: { organizationId },
  });
}

export async function disconnectSocialMediaAccount(
  accountId: string,
  organizationId: string
) {
  return prisma.socialMediaAccount.delete({
    where: {
      id: accountId,
      organizationId,
    },
  });
}
