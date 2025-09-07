import { z } from 'zod';
import { createChatSession, getChatSessions } from '@/utils/db/chat';
import { addMessage, getMessagesInSession } from '@/utils/db/message';
import { createRouter } from '../trpc';

export const chatRouter = createRouter({})
  .mutation('createSession', {
    input: z.object({ title: z.string().optional() }),
    async resolve({ ctx, input }) {
      return createChatSession(ctx.userId, input.title);
    },
  })
  .query('history', {
    async resolve({ ctx }) {
      return getChatSessions(ctx.userId);
    },
  })
  .mutation('addMessage', {
    input: z.object({
      sessionId: z.string(),
      content: z.string(),
      role: z.enum(['USER', 'ASSISTANT']),
    }),
    async resolve({ input }) {
      return addMessage(input.sessionId, input.content, input.role);
    },
  })
  .query('messages', {
    input: z.string(),
    async resolve({ input }) {
      return getMessagesInSession(input);
    },
  });
