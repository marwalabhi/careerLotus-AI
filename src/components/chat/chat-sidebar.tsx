'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Plus, Clock } from 'lucide-react';
import { ChatSession } from '@/types/chat';

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId?: string;
  onSessionSelect: (sessionId: string) => void;
  onNewSession: () => void;
}

export function ChatSidebar({
  sessions,
  currentSessionId,
  onSessionSelect,
  onNewSession,
}: ChatSidebarProps) {
  return (
    <Card className="h-full w-80 border-pink-200 bg-gradient-to-b from-pink-50 to-purple-50">
      <CardHeader className="border-b border-pink-200 bg-gradient-to-r from-pink-100 to-purple-100">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-purple-900">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-400 text-xs text-white">
            🪷
          </div>
          Chat Sessions
        </CardTitle>
        <Button
          onClick={onNewSession}
          className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Career Session
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="space-y-2 p-4">
            {sessions.map((session) => (
              <Button
                key={session.id}
                variant={currentSessionId === session.id ? 'default' : 'ghost'}
                onClick={() => onSessionSelect(session.id)}
                className={cn(
                  'h-auto w-full justify-start p-3 text-left',
                  currentSessionId === session.id
                    ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white'
                    : 'text-purple-700 hover:bg-pink-100'
                )}
              >
                <div className="flex w-full flex-col">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="truncate font-medium">{session.title}</span>
                    <Badge variant="secondary" className="bg-pink-200 text-xs text-pink-700">
                      {session.messageCount}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs opacity-70">
                    <Clock className="h-3 w-3" />
                    {session.lastMessageAt.toLocaleDateString()}
                  </div>
                </div>
              </Button>
            ))}

            {sessions.length === 0 && (
              <div className="py-8 text-center text-purple-500">
                <MessageSquare className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p className="text-sm">No chat sessions yet</p>
                <p className="text-xs">Start your first career conversation!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
