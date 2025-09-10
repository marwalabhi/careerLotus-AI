import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { prisma } from '@/lib/prisma';
import { openai } from '@/lib/openai';

const SYSTEM_PROMPT = `You are CareerLotus AI, an expert career counselor.
Provide practical, empathetic guidance with clear next steps,
suggest skills, roles, and resources tailored to the user's goals and background.`;

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
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          _count: { select: { messages: true } },
        },
      });
      let nextCursor: string | undefined = undefined;
      if (sessions.length > limit) {
        const next = sessions.pop();
        nextCursor = next?.id;
      }
      const withMeta = sessions.map((s) => ({
        id: s.id,
        title: s.title,
        messageCount: (s as any)._count?.messages ?? undefined,
        lastMessage: s.messages?.[0]?.content,
        lastMessageAt: s.messages?.[0]?.createdAt,
      }));
      return { sessions: withMeta, nextCursor };
    }),

  getSession: publicProcedure.input(z.object({ sessionId: z.uuid() })).query(async ({ input }) => {
    return prisma.chatSession.findUnique({
      where: { id: input.sessionId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
  }),

  sendMessage: publicProcedure
  .input(z.object({ sessionId: z.uuid(), content: z.string().min(1) }))
  .mutation(async ({ input }) => {
    try {
      const userMsg = await prisma.message.create({
        data: { chatSessionId: input.sessionId, role: 'USER', content: input.content },
      });

      const history = await prisma.message.findMany({
        where: { chatSessionId: input.sessionId },
        orderBy: { createdAt: 'asc' },
        take: 20,
      });

      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history.map((m) => ({
          role: m.role === 'USER' ? 'user' : ('assistant' as const),
          content: m.content,
        })),
      ];

      let aiText = 'Sorry, I encountered an error. Please try again.';

      try {
        console.log('🤖 Calling OpenAI...');
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          temperature: 0.4,
          messages,
        });

        aiText = completion.choices[0]?.message?.content?.trim() || 'I received an empty response. Please try again.';
        console.log('✅ OpenAI response received');
      } catch (error: any) {
        console.error('❌ OpenAI Error:', error?.message || error);
        aiText = `I'm having trouble connecting to my AI service. Error: ${error?.message || 'Unknown error'}. Please check your API key and try again.`;
      }

      const aiMsg = await prisma.message.create({
        data: { chatSessionId: input.sessionId, role: 'ASSISTANT', content: aiText },
      });

      return { userMsg, aiMsg };
    } catch (error: any) {
      console.error('❌ SendMessage error:', error);
      throw new Error(`Failed to send message: ${error?.message || 'Unknown error'}`);
    }
  }),

});
//   sendMessage: publicProcedure
//     .input(z.object({ sessionId: z.uuid(), content: z.string().min(1) }))
//     .mutation(async ({ input }) => {
//       const userMsg = await prisma.message.create({
//         data: { chatSessionId: input.sessionId, role: 'USER', content: input.content },
//       });

//       const history = await prisma.message.findMany({
//         where: { chatSessionId: input.sessionId },
//         orderBy: { createdAt: 'asc' },
//         take: 20, // last N messages for context
//       });

//       const messages = [
//         { role: 'system', content: SYSTEM_PROMPT },
//         ...history.map((m) => ({
//           role: m.role === 'USER' ? 'user' : ('assistant' as const),
//           content: m.content,
//         })),
//       ];

//       const completion = await openai.chat.completions.create({
//         model: 'gpt-4o-mini',
//         temperature: 0.4,
//         messages,
//       });

//       const aiText = completion.choices[0]?.message?.content?.trim() || '...';

//       const aiMsg = await prisma.message.create({
//         data: { chatSessionId: input.sessionId, role: 'ASSISTANT', content: aiText },
//       });

//       return { userMsg, aiMsg };
//     }),
// });
