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

interface ListSessionsResponse {
  sessions: ChatSessionListItem[];
}

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

  const renameSessionMutation = trpc.chat.renameSession.useMutation({
    onSuccess: async (_data, variables) => {
      await Promise.all([
        utils.chat.getSession.invalidate({ sessionId: variables.sessionId as unknown as string }),
        utils.chat.listSessions.invalidate(),
      ]);
    },
  });

  const deleteSessionMutation = trpc.chat.deleteSession.useMutation({
    onSuccess: async (_data, variables) => {
      await utils.chat.listSessions.invalidate();
    },
  });

  const clearSessionMutation = trpc.chat.clearSessionMessages.useMutation({
    onSuccess: async (_data, variables) => {
      await Promise.all([
        utils.chat.getSession.invalidate({ sessionId: variables.sessionId as unknown as string }),
        utils.chat.listSessions.invalidate(),
      ]);
    },
  });

  const createSession = useCallback(
    async (topic: string) => {
      setCreatingSession(true);
      try {
        const res = await createSessionMutation.mutateAsync({ topic });
        return res.id as string;
      } finally {
        setCreatingSession(false);
      }
    },
    [createSessionMutation]
  );

  const sendMessage = useCallback(
    async (id: string, content: string) => {
      return sendMessageMutation.mutateAsync({ sessionId: id as unknown as string, content });
    },
    [sendMessageMutation]
  );

  const renameSession = useCallback(
    async (id: string, title: string) => {
      return renameSessionMutation.mutateAsync({ sessionId: id as unknown as string, title });
    },
    [renameSessionMutation]
  );

  const deleteSession = useCallback(
    async (id: string) => {
      return deleteSessionMutation.mutateAsync({ sessionId: id as unknown as string });
    },
    [deleteSessionMutation]
  );

  const clearSession = useCallback(
    async (id: string) => {
      return clearSessionMutation.mutateAsync({ sessionId: id as unknown as string });
    },
    [clearSessionMutation]
  );

  const sessions: ChatSessionListItem[] | undefined = useMemo(() => {
    if (!list.data) return undefined;
    // list.data may already contain last message metadata if server provides it
    // Keep types permissive
    const data = list.data as ListSessionsResponse;
    return data.sessions?.map((s) => ({
      id: s.id,
      title: s.title,
      lastMessage: s.lastMessage,
      lastMessageAt: s.lastMessageAt,
      messageCount: s.messageCount,
    }));
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
    renameSession,
    deleting: deleteSessionMutation.isLoading,
    deleteSession,
    clearSession,
  };
}
