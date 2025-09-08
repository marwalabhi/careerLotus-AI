import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { prisma } from '@/lib/prisma';

export const chatRouter = router({
  createSession: publicProcedure
    .input(z.object({ topic: z.string().min(1) }))
    .mutation(async ({ input }) => {
      return prisma.chatSession.create({ data: { title: input.topic } });
    }),

  listSessions: publicProcedure
    .input(
      z
        .object({ cursor: z.string().nullish(), limit: z.number().min(1).max(50).default(20) })
        .optional()
    )
    .query(async ({ input }) => {
      const limit = input?.limit ?? 20;
      const sessions = await prisma.chatSession.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit + 1,
        cursor: input?.cursor ? { id: input.cursor } : undefined,
      });
      let nextCursor: string | undefined = undefined;
      if (sessions.length > limit) {
        const next = sessions.pop();
        nextCursor = next?.id;
      }
      return { sessions, nextCursor };
    }),

  getSession: publicProcedure
    .input(z.object({ sessionId: z.string().uuid() }))
    .query(async ({ input }) => {
      return prisma.chatSession.findUnique({
        where: { id: input.sessionId },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      });
    }),

  sendMessage: publicProcedure
    .input(z.object({ sessionId: z.string().uuid(), content: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const userMsg = await prisma.message.create({
        data: {
          chatSessionId: input.sessionId,
          role: 'USER', // enum as string literal
          content: input.content,
        },
      });

      const aiText = 'AI response placeholder';

      const aiMsg = await prisma.message.create({
        data: {
          chatSessionId: input.sessionId,
          role: 'ASSISTANT', // enum as string literal
          content: aiText,
        },
      });

      return { userMsg, aiMsg };
    }),
});
