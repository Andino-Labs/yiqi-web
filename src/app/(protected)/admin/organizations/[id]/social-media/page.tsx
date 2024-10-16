import React from "react";
import { ConnectedAccounts } from "@/components/social-media/ConnectedAccounts";
import { ConnectAccount } from "@/components/social-media/ConnectAccount";
import { getAccounts } from "@/services/actions/socialMediaActions";
import { getUser } from "@/lib/auth/lucia";
import { redirect } from "next/navigation";
import OrganizationLayout from "@/components/orgs/organizationLayout";

export default async function SocialMediaPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUser();
  if (!user) {
    redirect("/auth");
  }

  const accounts = await getAccounts(params.id);

  return (
    <OrganizationLayout
      orgId={params.id}
      userProps={{
        picture: user.picture!,
        email: user.email,
        name: user.name,
      }}
    >
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Social Media Accounts</h1>
        <ConnectedAccounts accounts={accounts} organizationId={params.id} />
        <ConnectAccount organizationId={params.id} />
      </div>
    </OrganizationLayout>
  );
}
