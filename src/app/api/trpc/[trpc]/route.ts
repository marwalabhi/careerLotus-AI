// tRPC API handler
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/api';
import { createContext } from '@/server/trpc';

const handler = (req: Request) =>
  fetchRequestHandler({
    router: appRouter,
    createContext,
    req,
    endpoint: '/api/trpc',
  });

export { handler as GET, handler as POST };
