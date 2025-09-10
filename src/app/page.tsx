import { ChatLayout } from '@/components/chat/chat-layout';
import RequireAuth from '@/components/RequireAuth';

export default function HomePage() {
  return (
    <RequireAuth>
      <div className="bg-background min-h-screen">
        <ChatLayout />
      </div>
    </RequireAuth>
  );
}
