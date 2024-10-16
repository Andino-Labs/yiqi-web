"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { connectAccount } from "@/services/actions/socialMediaActions";
import { SocialMediaPlatform } from "@prisma/client";
import { ConnectAccountInput } from "@/schemas/socialMediaSchemas";
import axios from "axios";

interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
  category: string;
  tasks: string[];
}

export default function SelectAccountsPage({
  params,
}: {
  params: { id: string };
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [accounts, setAccounts] = useState<FacebookPage[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      const accessToken = searchParams.get("accessToken");
      const userId = searchParams.get("userId");

      if (!accessToken || !userId) {
        router.push(
          `/admin/organizations/${params.id}/social-media?error=Invalid parameters`
        );
        return;
      }

      try {
        const fetchedAccounts = await fetchFacebookPages(accessToken, userId);
        setAccounts(fetchedAccounts);
      } catch (error) {
        console.error("Error fetching Facebook pages:", error);
        router.push(
          `/admin/organizations/${params.id}/social-media?error=Failed to fetch accounts`
        );
      }
    };

    fetchAccounts();
  }, [searchParams, params.id, router]);

  const handleAccountSelection = (accountId: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleSubmit = async () => {
    for (const accountId of selectedAccounts) {
      const account = accounts.find((a) => a.id === accountId);
      if (account) {
        const connectAccountInput: ConnectAccountInput = {
          organizationId: params.id,
          platform: SocialMediaPlatform.FACEBOOK,
          accountId: account.id,
          accountName: account.name,
          accessToken: account.access_token,
          refreshToken: null,
          expiresAt: null,
          scope: account.tasks,
        };

        await connectAccount(connectAccountInput);
      }
    }

    router.push(`/admin/organizations/${params.id}/social-media?success=true`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Select Pages to Connect</h1>
      {accounts.map((account) => (
        <div key={account.id} className="flex items-center space-x-2 mb-2">
          <Checkbox
            id={account.id}
            checked={selectedAccounts.includes(account.id)}
            onCheckedChange={() => handleAccountSelection(account.id)}
          />
          <label htmlFor={account.id}>
            {account.name} ({account.category})
          </label>
        </div>
      ))}
      <Button onClick={handleSubmit} className="mt-4">
        Connect Selected Pages
      </Button>
    </div>
  );
}

async function fetchFacebookPages(
  accessToken: string,
  userId: string
): Promise<FacebookPage[]> {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v21.0/${userId}/accounts`,
      {
        params: {
          access_token: accessToken,
          fields: "id,name,access_token,category,tasks",
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error("Error fetching Facebook pages:", error);
    throw error;
  }
}
