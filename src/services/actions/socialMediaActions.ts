"use server";

import { getUser, isOrganizerAdmin } from "@/lib/auth/lucia";
import {
  connectSocialMediaAccount,
  getSocialMediaAccounts,
  disconnectSocialMediaAccount,
} from "@/lib/socialMedia";
import { SocialMediaPlatform } from "@prisma/client";

export async function connectAccount(
  organizationId: string,
  platform: SocialMediaPlatform,
  accountId: string,
  accountName: string,
  accessToken: string,
  refreshToken: string | null,
  expiresAt: Date | null,
  scope: string[]
) {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const isAdmin = await isOrganizerAdmin(organizationId, user.id);
  if (!isAdmin) {
    throw new Error("Unauthorized to modify this organization");
  }

  return connectSocialMediaAccount(
    organizationId,
    platform,
    accountId,
    accountName,
    accessToken,
    refreshToken,
    expiresAt,
    scope
  );
}

export async function getAccounts(organizationId: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const isAdmin = await isOrganizerAdmin(organizationId, user.id);
  if (!isAdmin) {
    throw new Error("Unauthorized to view accounts for this organization");
  }

  return getSocialMediaAccounts(organizationId);
}

export async function disconnectAccount(
  accountId: string,
  organizationId: string
) {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const isAdmin = await isOrganizerAdmin(organizationId, user.id);
  if (!isAdmin) {
    throw new Error("Unauthorized to modify this organization");
  }

  return disconnectSocialMediaAccount(accountId, organizationId);
}

export async function initiateOAuthFlow(
  organizationId: string,
  platform: SocialMediaPlatform
) {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const isAdmin = await isOrganizerAdmin(organizationId, user.id);
  if (!isAdmin) {
    throw new Error("Unauthorized to modify this organization");
  }

  const baseCallbackUrl = `${
    process.env.NEXT_PUBLIC_BASE_URL
  }/api/oauth/${platform.toLowerCase()}/callback`;

  const scope = [
    "email",
    "pages_show_list",
    "pages_read_engagement",
    "pages_manage_posts",
    "pages_manage_engagement",
    "instagram_basic",
    "instagram_content_publish",
    "instagram_manage_comments",
    "instagram_manage_insights",
  ].join(",");

  const authUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${baseCallbackUrl}&state=${organizationId}&scope=${scope}&response_type=code`;

  return { authUrl };
}
