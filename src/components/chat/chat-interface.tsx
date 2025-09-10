'use client';

import type React from 'react';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Paperclip, Mic, Square, User, Sparkles } from 'lucide-react';
import { useChat } from '@/hooks/useChat';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatInterfaceProps {
  sessionId: string | null;
  onSessionCreated: (sessionId: string) => void;
}

export function ChatInterface({ sessionId, onSessionCreated }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { sessionQuery, createSession, sendMessage, sending } = useChat(sessionId);

  // Load messages from server
  useEffect(() => {
    if (sessionQuery.data?.messages) {
      const mapped: Message[] = sessionQuery.data.messages.map((m: any) => ({
        id: m.id,
        content: m.content,
        sender: m.role === 'USER' ? 'user' : 'ai',
        timestamp: new Date(m.createdAt),
      }));
      setMessages(mapped);
    } else if (!sessionId) {
      setMessages([
        {
          id: 'welcome',
          content:
            "Welcome to CareerLotus AI! 🌸 I'm here to help you bloom in your career journey. Whether you're exploring new opportunities, developing skills, or navigating career transitions, I'm here to provide personalized guidance. What would you like to discuss today?",
          sender: 'ai',
          timestamp: new Date(),
        },
      ]);
    }
  }, [sessionId, sessionQuery.data]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // const handleSendMessage = async () => {
  //   if (!inputValue.trim() || isLoading || sending) return;

  //   const userMessage: Message = {
  //     id: Date.now().toString(),
  //     content: inputValue,
  //     sender: 'user',
  //     timestamp: new Date(),
  //   };

  //   setMessages((prev) => [...prev, userMessage]);
  //   setInputValue('');
  //   setIsLoading(true);

  //   try {
  //     let activeId = sessionId;
  //     if (!activeId) {
  //       activeId = await createSession(inputValue.slice(0, 60));
  //       onSessionCreated(activeId);
  //     }
  //     await sendMessage(activeId!, userMessage.content);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || sending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      let activeId = sessionId;
      if (!activeId) {
        activeId = await createSession(inputValue.slice(0, 60));
        onSessionCreated(activeId);
      }
      await sendMessage(activeId!, userMessage.content);
    } catch (error: any) {
      console.error('❌ Send message error:', error);
      // Add error message to chat
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        content: `Sorry, I encountered an error: ${error?.message || 'Unknown error'}. Please try again.`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement voice recording functionality
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className="from-background to-background/95 flex h-full flex-col overflow-hidden bg-gradient-to-b">
      {/* Chat Header */}
      <div className="border-border bg-card/50 flex flex-shrink-0 items-center justify-between border-b p-6 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Avatar className="ring-primary/20 h-10 w-10 shadow-sm ring-2">
            <AvatarImage src="/ai-counselor-avatar.jpg" />
            <AvatarFallback className="from-primary to-accent text-primary-foreground bg-gradient-to-br">
              🪷
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-foreground text-lg font-bold">CareerLotus AI</h2>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
              <span className="text-muted-foreground text-sm">Online & Ready to Help</span>
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20 text-xs"
              >
                <Sparkles className="mr-1 h-3 w-3" />
                AI Powered
              </Badge>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="bg-primary/5 border-primary/20 cursor-pointer hover:bg-green-700 hover:text-white"
          onClick={() => onSessionCreated(`session-${Date.now()}`)}
        >
          + New Chat
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div className="p-6">
            <div className="mx-auto max-w-4xl space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'ai' && (
                    <Avatar className="ring-primary/20 h-9 w-9 flex-shrink-0 shadow-sm ring-2">
                      <AvatarImage src="/ai-counselor-avatar.jpg" />
                      <AvatarFallback className="from-primary to-accent text-primary-foreground bg-gradient-to-br">
                        🪷
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`flex max-w-[75%] flex-col gap-2 ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-sm ${
                        message.sender === 'user'
                          ? 'from-primary to-primary/90 text-primary-foreground bg-gradient-to-br'
                          : 'bg-card border-border/50 text-card-foreground border'
                      } `}
                    >
                      {message.content}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground px-2 text-xs">
                        {formatTime(message.timestamp)}
                      </span>
                      {message.sender === 'user' && (
                        <div className="bg-primary/20 flex h-4 w-4 items-center justify-center rounded-full">
                          <div className="bg-primary h-2 w-2 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {message.sender === 'user' && (
                    <Avatar className="ring-primary/20 h-9 w-9 flex-shrink-0 shadow-sm ring-2">
                      <AvatarImage src="/placeholder-user.png" />
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start gap-4">
                  <Avatar className="ring-primary/20 h-9 w-9 flex-shrink-0 shadow-sm ring-2">
                    <AvatarImage src="/ai-counselor-avatar.jpg" />
                    <AvatarFallback className="from-primary to-accent text-primary-foreground bg-gradient-to-br">
                      🪷
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-card border-border/50 rounded-2xl border px-5 py-4 shadow-sm">
                    <div className="flex gap-1">
                      <div className="bg-primary h-2 w-2 animate-bounce rounded-full"></div>
                      <div
                        className="bg-primary h-2 w-2 animate-bounce rounded-full"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="bg-primary h-2 w-2 animate-bounce rounded-full"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="border-border bg-card/30 flex-shrink-0 border-t backdrop-blur-sm">
        <div className="mx-auto max-w-4xl">
          {messages.length <= 1 && (
            <div className="my-9 space-y-3">
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() =>
                    setInputValue('Can you help me organize a career development plan?')
                  }
                  className="bg-card hover:bg-card/80 border-border/50 text-muted-foreground hover:text-foreground rounded-full border px-4 py-2 text-sm transition-colors"
                >
                  Can you help me organize a career development plan?
                </button>
                <button
                  onClick={() =>
                    setInputValue('What are common mistakes people make when changing careers?')
                  }
                  className="bg-card hover:bg-card/80 border-border/50 text-muted-foreground hover:text-foreground rounded-full border px-4 py-2 text-sm transition-colors"
                >
                  What are common mistakes people make when changing careers?
                </button>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setInputValue('How do I improve my interview skills?')}
                  className="bg-card hover:bg-card/80 border-border/50 text-muted-foreground hover:text-foreground rounded-full border px-4 py-2 text-sm transition-colors"
                >
                  How do I improve my interview skills?
                </button>
                <button
                  onClick={() => setInputValue('What skills should I develop for my industry?')}
                  className="bg-card hover:bg-card/80 border-border/50 text-muted-foreground hover:text-foreground rounded-full border px-4 py-2 text-sm transition-colors"
                >
                  What skills should I develop for my industry?
                </button>
              </div>
            </div>
          )}

          <div className="bg-card border-border/50 rounded-2xl border p-4 shadow-lg">
            <div className="flex items-end gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground flex-shrink-0"
              >
                <Paperclip className="h-5 w-5" />
              </Button>

              <div className="relative flex-1">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about your career path..."
                  className="placeholder:text-muted-foreground min-h-[44px] border-0 bg-transparent px-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={isLoading}
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className={`flex-shrink-0 cursor-pointer ${isRecording ? 'text-destructive' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={toggleRecording}
              >
                {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>

              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
                className="from-primary to-primary/90 hover:from-primary/90 hover:to-primary flex-shrink-0 cursor-pointer rounded-xl bg-gradient-to-r shadow-sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="text-muted-foreground my-3 text-center text-xs">
            🌸 CareerLotus AI • Helping you bloom in your professional journey
          </p>
        </div>
      </div>
    </div>
  );
}
