import { useCallback, useMemo, useState } from 'react';
import { trpc } from '@/utils/trpc';

export type ChatMessage = {
  id: string;
  content: string;
  role: 'USER' | 'ASSISTANT';
  createdAt: string | Date;
};

export type ChatSessionListItem = {
  id: string;
  title: string;
  lastMessage?: string;
  lastMessageAt?: string;
  messageCount?: number;
};

export function useChat(sessionId: string | null) {
  const utils = trpc.useUtils();

  const [creatingSession, setCreatingSession] = useState(false);

  const list = trpc.chat.listSessions.useQuery(undefined, { staleTime: 30_000 });

  const session = trpc.chat.getSession.useQuery(
    { sessionId: sessionId as unknown as string },
    { enabled: Boolean(sessionId) }
  );

  const createSessionMutation = trpc.chat.createSession.useMutation({
    onSuccess: async () => {
      await utils.chat.listSessions.invalidate();
    },
  });

  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: async (_data, variables) => {
      // Refresh session messages and list
      await Promise.all([
        utils.chat.getSession.invalidate({ sessionId: variables.sessionId }),
        utils.chat.listSessions.invalidate(),
      ]);
    },
  });

  const createSession = useCallback(async (topic: string) => {
    setCreatingSession(true);
    try {
      const res = await createSessionMutation.mutateAsync({ topic });
      return res.id as string;
    } finally {
      setCreatingSession(false);
    }
  }, [createSessionMutation]);

  const sendMessage = useCallback(async (id: string, content: string) => {
    return sendMessageMutation.mutateAsync({ sessionId: id as unknown as any, content });
  }, [sendMessageMutation]);

  const sessions: ChatSessionListItem[] | undefined = useMemo(() => {
    if (!list.data) return undefined;
    // list.data may already contain last message metadata if server provides it
    // Keep types permissive
    return (list.data as any).sessions?.map((s: any) => ({
      id: s.id,
      title: s.title,
      lastMessage: s.lastMessage,
      lastMessageAt: s.lastMessageAt,
      messageCount: s.messageCount,
    })) ?? (list.data as any).sessions;
  }, [list.data]);

  return {
    // collections
    sessions,
    listSessionsQuery: list,
    sessionQuery: session,

    // actions
    createSession,
    creatingSession,
    sendMessage,
    sending: sendMessageMutation.isLoading,
  };
}


