'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Settings, Moon, Sun, Menu, X, User, LogOut } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useTheme } from 'next-themes';
import { ChatInterface } from './chat-interface';
import { SessionList } from './session-list';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export function ChatLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string>('Guest User');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const guest =
        typeof window !== 'undefined' && localStorage.getItem('careerlotus_guest') === '1';
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      if (guest) {
        setDisplayName('Guest User');
      } else if (data.user) {
        const full = (data.user.user_metadata as any)?.full_name as string | undefined;
        setDisplayName(full || data.user.email || 'User');
      } else {
        setDisplayName('Guest User');
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      if (typeof window !== 'undefined') localStorage.removeItem('careerlotus_guest');
      await supabase.auth.signOut();
    } finally {
      router.replace('/auth');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={toggleSidebar} />
      )}

      {/* Sidebar */}
      <div
        className={`bg-sidebar border-sidebar-border fixed inset-y-0 left-0 z-50 flex w-80 transform flex-col border-r transition-transform duration-200 ease-in-out lg:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} `}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-sidebar-border bg-sidebar/50 flex items-center justify-between border-b p-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-lg shadow-sm">
                <span className="text-lg">🪷</span>
              </div>
              <div>
                <h1 className="text-sidebar-foreground text-base font-semibold">CareerLotus</h1>
                <p className="text-muted-foreground text-xs">AI Career Counselor</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 lg:hidden"
              onClick={toggleSidebar}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 w-full justify-start gap-3 rounded-lg font-medium shadow-sm"
              onClick={() => setActiveSessionId(null)}
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>

          {/* Session List */}
          <div className="flex-1 overflow-y-auto px-4">
            <SessionList activeSessionId={activeSessionId} onSessionSelect={setActiveSessionId} />
          </div>

          {/* Footer */}
          <div className="border-sidebar-border border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder-user.png" />
                  <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sidebar-foreground truncate text-sm font-medium">
                    {displayName}
                  </p>
                  <p className="text-muted-foreground text-xs">Free Plan</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="h-8 w-8 hover:bg-blue-100 hover:text-blue-900"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>

                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative h-8 w-8 hover:bg-green-100 hover:text-black"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="z-[100] min-w-[160px] rounded-md bg-white p-1 shadow-md dark:bg-gray-800"
                      sideOffset={5}
                      align="end"
                    >
                      <DropdownMenu.Item
                        className="flex cursor-pointer items-center rounded-sm px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="border-border bg-card flex flex-shrink-0 items-center justify-between border-b p-4 lg:hidden">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-lg">🪷</span>
            <span className="text-base font-semibold">CareerLotus</span>
          </div>
          <div className="w-10" />
        </div>

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface sessionId={activeSessionId} onSessionCreated={setActiveSessionId} />
        </div>
      </div>
    </div>
  );
}
