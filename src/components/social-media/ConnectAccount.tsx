"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { SocialMediaPlatform } from "@prisma/client";
import { initiateOAuthFlow } from "@/services/actions/socialMediaActions";
import { useToast } from "@/hooks/use-toast";

interface ConnectAccountProps {
  organizationId: string;
}

export function ConnectAccount({ organizationId }: ConnectAccountProps) {
  const { toast } = useToast();

  const handleConnect = async (platform: SocialMediaPlatform) => {
    try {
      const { authUrl } = await initiateOAuthFlow(organizationId, platform);
      window.location.href = authUrl;
    } catch (error) {
      console.error(`Error initiating ${platform} OAuth:`, error);
      toast({
        title: "Error",
        description: `Failed to connect to ${platform}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Connect New Account</h2>
      <div className="space-y-2">
        <Button onClick={() => handleConnect("FACEBOOK")} className="w-full">
          Connect Facebook
        </Button>
        <Button onClick={() => handleConnect("INSTAGRAM")} className="w-full">
          Connect Instagram
        </Button>
      </div>
    </div>
  );
}
