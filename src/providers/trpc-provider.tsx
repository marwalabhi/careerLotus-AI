'use client';

import { httpBatchLink, loggerLink } from '@trpc/client';
import SuperJSON from 'superjson';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from '@/utils/trpc';
import { useState } from 'react';

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink(),
        httpBatchLink({
          url: '/api/trpc',
          transformer: SuperJSON,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
