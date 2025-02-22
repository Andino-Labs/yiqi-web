"use client";

import { createTwitterAccount } from "@/services/actions/management-tool/channels/twitter/createTwitterAccount";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  id: string;
}

export default function RedirectPage({ user }: { user: User }) {

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();

  const storedOrgId = localStorage.getItem("orgId");

  useEffect(() => {
    const processTwitterAccount = async () => {
      const params = new URLSearchParams(window.location.search);
      const oauthToken = params.get("oauth_token");
      const oauthVerifier = params.get("oauth_verifier");

      if (oauthToken && oauthVerifier) {
        try {
          const response = await fetch("/api/twitter/exchange-tokens", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              oauth_token: oauthToken,
              oauth_verifier: oauthVerifier,
            }),
          });

          const data = await response.json();

          if (data.success) {
            setSuccess(true);

            await createTwitterAccount({
              userIdApp: user.id,
              organizationId: storedOrgId,
              ...data,
            });

            router.push(
              `/admin/organizations/${storedOrgId}/management-tool`
            );
          } else {
            setError(data.error || "Error desconocido.");
          }
        } catch (err) {
          console.error("Error al intercambiar tokens:", err);
          setError("Error al conectar con la API.");
        }
      } else {
        setError("Faltan parámetros en la URL.");
      }
    };

    processTwitterAccount();
  }, [storedOrgId, router, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      {success ? (
        <h2 className="text-green-500 font-bold text-2xl">
          Cuenta de Twitter conectada con éxito.
        </h2>
      ) : error ? (
        <h2 className="text-red-500 font-bold text-2xl">Error: {error}</h2>
      ) : (
        <h2 className="text-blue-500 font-bold text-2xl">Conectando con Twitter...</h2>
      )}
    </div>
  );
}
