// Chat history page
'use client';
import { trpc } from '@/utils/trpc';

export default function HistoryPage() {
  const { data, fetchNextPage, hasNextPage, isLoading } = trpc.chat.listSessions.useInfiniteQuery(
    { limit: 20 },
    { getNextPageParam: (last) => last.nextCursor }
  );

  if (isLoading) return <div>Loading...</div>;

  const sessions = data?.pages.flatMap((p) => p.sessions) ?? [];
  return (
    <div>
      {sessions.map((s) => (
        <div key={s.id}>{s.title}</div>
      ))}
      {hasNextPage && <button onClick={() => fetchNextPage()}>Load more</button>}
    </div>
  );
}
