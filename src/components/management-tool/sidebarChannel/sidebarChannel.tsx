'use client';

import { BiXIcon } from '@/assets/icons';
import { DataTwitterSchema } from '@/schemas/twitterSchema';
import { useEffect } from 'react';

export function SidebarChannel({ data }: { data: DataTwitterSchema }) {

  const handleConnectTwitter = async () => {
    window.location.href = `${process.env.NEXT_PUBLIC_URL}${process.env.NEXT_PUBLIC_X_REDIRECT_AUTH_URI}`;
  };

  useEffect(() => {
    const url = window.location.href;

    const match = url.match(/\/organizations\/([a-zA-Z0-9]+)/);

    const id = match ? match[1] : '';
    localStorage.setItem('orgId', id);
  }, []);

  return (
    <aside className="w-60 p-4 space-y-4">
      <nav className="space-y-2">
        {['Twitter/X'].map((channel) => (
          <button
            key={channel}
            className="w-full text-left py-1.5 rounded-md flex items-center gap-2 group"
            onClick={() => {
              if (!data) {
                handleConnectTwitter();
              }
            }}
          >
            <div className="relative w-8 h-8 flex items-center justify-center rounded-full group-hover:bg-white transition-colors">
              <BiXIcon className="w-6 h-6 text-gray-600 group-hover:text-black transition-colors" />
            </div>
            <span className="text-sm">
              {data && data.accountUsername !== null ? 'Cuenta conectada' : 'Conecta X/Twitter'}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
