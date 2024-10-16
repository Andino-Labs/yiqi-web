"use server";

import { getUser, isOrganizerAdmin } from "@/lib/auth/lucia";
import {
  connectSocialMediaAccount,
  getSocialMediaAccounts,
  disconnectSocialMediaAccount,
} from "@/lib/socialMedia";
import {
  ConnectAccountInput,
  ConnectAccountInputSchema,
  InitiateOAuthFlowInput,
  InitiateOAuthFlowInputSchema,
  InitiateOAuthFlowOutputSchema,
  SocialMediaAccount,
  SocialMediaAccountSchema,
} from "@/schemas/socialMediaSchemas";
import { z } from "zod";

export async function connectAccount(input: ConnectAccountInput) {
  const validatedInput = ConnectAccountInputSchema.parse(input);
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const isAdmin = await isOrganizerAdmin(
    validatedInput.organizationId,
    user.id
  );
  if (!isAdmin) {
    throw new Error("Unauthorized to modify this organization");
  }

  const result = await connectSocialMediaAccount(validatedInput);
  return SocialMediaAccountSchema.parse(result);
}

export async function getAccounts(
  organizationId: string
): Promise<SocialMediaAccount[]> {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const isAdmin = await isOrganizerAdmin(organizationId, user.id);
  if (!isAdmin) {
    throw new Error("Unauthorized to view accounts for this organization");
  }

  const accounts = await getSocialMediaAccounts(organizationId);
  return z.array(SocialMediaAccountSchema).parse(accounts);
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

  await disconnectSocialMediaAccount(accountId, organizationId);
}

export async function initiateOAuthFlow(input: InitiateOAuthFlowInput) {
  const validatedInput = InitiateOAuthFlowInputSchema.parse(input);
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const isAdmin = await isOrganizerAdmin(
    validatedInput.organizationId,
    user.id
  );
  if (!isAdmin) {
    throw new Error("Unauthorized to modify this organization");
  }

  const baseCallbackUrl = `${
    process.env.NEXT_PUBLIC_BASE_URL
  }/api/oauth/${validatedInput.platform.toLowerCase()}/callback`;

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

  const authUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${baseCallbackUrl}&state=${validatedInput.organizationId}&scope=${scope}&response_type=code`;

  return InitiateOAuthFlowOutputSchema.parse({ authUrl });
}
