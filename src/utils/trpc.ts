// tRPC client hooks for frontend

import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/api'; // or where you export it
export const trpc = createTRPCReact<AppRouter>();
