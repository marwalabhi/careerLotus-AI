// Core tRPC setup: context, router factory

import { initTRPC } from '@trpc/server';

// Context creation (can pass request info, auth tokens, etc.)
export const createContext = (opts: unknown) => {
  return {};
};
export type Context = Awaited<typeof createContext>;

// tRPC backend init with context
const t = initTRPC.context<Context>().create();

export const createRouter = t.router;
export const publicProcedure = t.procedure;
