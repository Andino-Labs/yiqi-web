import { NextRequest, NextResponse } from "next/server";
import { connectAccount } from "@/services/actions/socialMediaActions";
import { SocialMediaPlatform } from "@prisma/client";
import axios from "axios";

export async function GET(
  req: NextRequest,
  { params }: { params: { platform: string } }
) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // This is the organizationId

  if (!code || !state) {
    return NextResponse.redirect("/error?message=Invalid OAuth callback");
  }

  try {
    const platform = params.platform.toUpperCase() as SocialMediaPlatform;

    const {
      accessToken,
      refreshToken,
      expiresAt,
      accountId,
      accountName,
      scope,
    } = await exchangeCodeForToken(platform, code);

    await connectAccount(
      state,
      platform,
      accountId,
      accountName,
      accessToken,
      refreshToken,
      expiresAt,
      scope
    );

    return NextResponse.redirect(
      `/admin/organizations/${state}/social-media?success=true`
    );
  } catch (error) {
    console.error("Error in OAuth callback:", error);
    return NextResponse.redirect("/error?message=Failed to connect account");
  }
}

async function exchangeCodeForToken(
  platform: SocialMediaPlatform,
  code: string
) {
  const tokenResponse = await axios.get(
    "https://graph.facebook.com/v21.0/oauth/access_token",
    {
      params: {
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        redirect_uri: `${
          process.env.NEXT_PUBLIC_BASE_URL
        }/api/oauth/${platform.toLowerCase()}/callback`,
        code,
      },
    }
  );

  const { access_token } = tokenResponse.data;

  const profileResponse = await axios.get("https://graph.facebook.com/me", {
    params: {
      fields: "id,name",
      access_token,
    },
  });

  const { id, name } = profileResponse.data;

  const longLivedTokenResponse = await axios.get(
    "https://graph.facebook.com/v21.0/oauth/access_token",
    {
      params: {
        grant_type: "fb_exchange_token",
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        fb_exchange_token: access_token,
      },
    }
  );

  const { access_token: longLivedToken, expires_in: longLivedExpires } =
    longLivedTokenResponse.data;

  return {
    accessToken: longLivedToken,
    refreshToken: null, // Facebook doesn't provide refresh tokens for long-lived tokens
    expiresAt: new Date(Date.now() + longLivedExpires * 1000),
    accountId: id,
    accountName: name,
    scope: tokenResponse.data.scope.split(","),
  };
}
