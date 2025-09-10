import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { prisma } from '@/lib/prisma';
import { genAI, makeGeminiRequest, convertMessagesToGeminiFormat } from '@/lib/gemini';

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

  renameSession: publicProcedure
    .input(z.object({ sessionId: z.uuid(), title: z.string().min(1).max(120) }))
    .mutation(async ({ input }) => {
      const updated = await prisma.chatSession.update({
        where: { id: input.sessionId },
        data: { title: input.title },
      });
      return updated;
    }),

  deleteSession: publicProcedure
    .input(z.object({ sessionId: z.uuid() }))
    .mutation(async ({ input }) => {
      await prisma.chatSession.delete({ where: { id: input.sessionId } });
      return { ok: true };
    }),

  clearSessionMessages: publicProcedure
    .input(z.object({ sessionId: z.uuid() }))
    .mutation(async ({ input }) => {
      await prisma.message.deleteMany({ where: { chatSessionId: input.sessionId } });
      return { ok: true };
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

        let aiText: string;

        try {
          console.log('🤖 Calling Gemini...');

          // Convert messages to Gemini format
          const { messages: geminiMessages, systemInstruction } =
            convertMessagesToGeminiFormat(messages);

          // Get the Gemini model
          const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: systemInstruction,
          });

          // Create chat session with history
          const chat = model.startChat({
            history: geminiMessages.slice(0, -1), // All messages except the last one
          });

          // Send the latest message
          const result = await makeGeminiRequest(async () => {
            return await chat.sendMessage(geminiMessages[geminiMessages.length - 1].parts[0].text);
          });

          const response = result.response;
          aiText = response.text().trim() || 'I received an empty response. Please try again.';
          console.log('✅ Gemini response received');
        } catch (error: any) {
          console.error('❌ Gemini Error:', error?.message || error);
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
