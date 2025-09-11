'use client';

import type React from 'react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, MoreHorizontal, Trash2, Edit3, Clock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useChat } from '@/hooks/useChat';

interface ChatSession {
  id: string;
  title: string;
  lastMessage?: string;
  lastMessageAt?: string | Date;
  messageCount?: number;
}

interface SessionListProps {
  activeSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
}

export function SessionList({ activeSessionId, onSessionSelect }: SessionListProps) {
  const { sessions: rawSessions, listSessionsQuery, deleteSession, renameSession } = useChat(null);
  const sessions = useMemo(() => rawSessions ?? [], [rawSessions]);

  const [renameOpen, setRenameOpen] = useState(false);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState('');
  const [saving, setSaving] = useState(false);

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteSession(sessionId);
    } catch (err) {
      console.error('Failed to delete session', err);
    }
  };

  const handleRenameSession = (sessionId: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenameId(sessionId);
    setRenameTitle(title ?? '');
    setRenameOpen(true);
  };

  const submitRename = async () => {
    if (!renameId || !renameTitle.trim()) {
      setRenameOpen(false);
      return;
    }
    try {
      setSaving(true);
      await renameSession(renameId, renameTitle.trim());
      setRenameOpen(false);
    } catch (err) {
      console.error('Failed to rename session', err);
    } finally {
      setSaving(false);
    }
  };

  let body: React.ReactNode;

  if (listSessionsQuery.isLoading) {
    body = (
      <div className="px-4 py-8 text-center">
        <p className="text-muted-foreground text-sm">Loading sessions…</p>
      </div>
    );
  } else if (sessions.length === 0) {
    // Updated empty state with lotus theme
    body = (
      <div className="px-4 py-8 text-center">
        <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <span className="text-2xl">🪷</span>
        </div>
        <p className="text-muted-foreground mb-2 text-sm">No chat sessions yet</p>
        <p className="text-muted-foreground text-xs">Start your first career conversation!</p>
      </div>
    );
  } else {
    body = (
      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="space-y-2">
          {sessions.map((session: ChatSession) => {
            const isActive = activeSessionId === session.id;
            const cardStateClass = isActive
              ? 'bg-primary/10 border-primary/20 shadow-sm'
              : 'hover:bg-sidebar-accent/30 hover:border-border/50 border-transparent';

            const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (ev) => {
              if (ev.key === 'Enter' || ev.key === ' ') {
                ev.preventDefault();
                onSessionSelect(session.id);
              }
            };

            return (
              <div
                key={session.id}
                role="button"
                tabIndex={0}
                className={`group relative w-full cursor-pointer rounded-xl border p-4 transition-all duration-200 sm:w-[230px] md:w-[295px] ${cardStateClass} `}
                onClick={() => onSessionSelect(session.id)}
                onKeyDown={handleKeyDown}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                      <MessageCircle className="text-primary h-4 w-4" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-sidebar-foreground truncate text-sm font-medium">
                        {session.title}
                      </h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-primary/10 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            onClick={(e) => handleRenameSession(session.id, session.title, e)}
                          >
                            <Edit3 className="mr-2 h-3 w-3" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => handleDeleteSession(session.id, e)}
                            className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:!text-destructive data-[highlighted]:!text-destructive"
                          >
                            <Trash2 className="mr-2 h-3 w-3" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-muted-foreground mb-3 line-clamp-2 text-xs leading-relaxed">
                      {session.lastMessage ?? 'No messages yet'}
                    </p>
                    <div className="text-muted-foreground flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.lastMessageAt
                          ? new Date(session.lastMessageAt).toLocaleString()
                          : '—'}
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-primary/5 border-primary/20 text-primary text-xs"
                      >
                        {session.messageCount ?? 0} msgs
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    );
  }

  return (
    <div className="space-y-3">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sidebar-foreground flex items-center gap-2 text-sm font-semibold">
          🪷 Chat Sessions
        </h2>
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
          {sessions?.length ?? 0}
        </Badge>
      </div>

      {body}

      {renameOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setRenameOpen(false)} />
          <div className="bg-background relative z-10 w-[90vw] max-w-md rounded-2xl border p-5 shadow-xl">
            <h3 className="mb-3 text-base font-semibold">Rename Chat</h3>
            <input
              autoFocus
              type="text"
              value={renameTitle}
              onChange={(e) => setRenameTitle(e.target.value)}
              className="bg-card text-card-foreground focus-visible:ring-primary block w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2"
              placeholder="Enter a new session title"
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitRename();
                if (e.key === 'Escape') setRenameOpen(false);
              }}
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setRenameOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submitRename} disabled={saving || !renameTitle.trim()}>
                {saving ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
