'use client';

import { useState } from 'react';
import { ChatInterface } from '@/components/chat/chat-interface';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { ChatSession } from '@/types/chat';

export default function HomePage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>();

  const handleNewSession = () => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: `Career Session ${sessions.length + 1}`,
      createdAt: new Date(),
      lastMessageAt: new Date(),
      messageCount: 0,
    };

    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const handleSessionSelect = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      <div className="container mx-auto p-4">
        <header className="mb-6 text-center">
          <h1 className="mb-2 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
            CareerLotus AI
          </h1>
          <p className="text-lg text-purple-600">Bloom Your Career Potential 🪷</p>
        </header>

        <div className="flex h-[700px] gap-6">
          <ChatSidebar
            sessions={sessions}
            currentSessionId={currentSessionId}
            onSessionSelect={handleSessionSelect}
            onNewSession={handleNewSession}
          />

          <div className="flex-1">
            <ChatInterface sessionId={currentSessionId} onNewSession={handleNewSession} />
          </div>
        </div>
      </div>
    </div>
  );
}
