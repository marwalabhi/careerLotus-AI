'use client';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, Plus, MessageSquare, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage } from '@/types/chat';

interface ChatInterfaceProps {
  sessionId?: string;
  onNewSession: () => void;
}

export function ChatInterface({ sessionId, onNewSession }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
      sessionId: sessionId || 'default',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // TODO: Integrate with tRPC API call here
      // Simulated AI response for now
      setTimeout(() => {
        const aiMessage: ChatMessage = {
          id: crypto.randomUUID(),
          content: `Thank you for your question about "${input}". As your AI career counselor, I'm here to help guide you through your career journey. Like a lotus that blooms beautifully even in challenging conditions, your career can flourish with the right guidance and support.`,
          role: 'assistant',
          timestamp: new Date(),
          sessionId: sessionId || 'default',
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      console.error('Error sending message:', error);
    }
  };

  return (
    <Card className="flex h-[600px] flex-col border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50">
      <CardHeader className="border-b border-pink-200 bg-gradient-to-r from-pink-100 to-purple-100">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-purple-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-400">
              🪷
            </div>
            CareerLotus AI
          </CardTitle>
          <Button
            onClick={onNewSession}
            variant="outline"
            size="sm"
            className="border-pink-300 bg-pink-100 text-pink-700 hover:bg-pink-200"
          >
            <Plus className="mr-1 h-4 w-4" />
            New Chat
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="py-8 text-center text-purple-600">
                <div className="mb-4 text-4xl">🪷</div>
                <h3 className="mb-2 text-lg font-semibold">Welcome to CareerLotus AI</h3>
                <p className="text-sm text-purple-500">
                  Like a lotus that blooms in any condition, let's help your career flourish!
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex w-full',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-lg px-4 py-2 shadow-sm',
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white'
                      : 'border border-pink-200 bg-white text-purple-900'
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={cn(
                      'mt-1 text-xs',
                      message.role === 'user' ? 'text-pink-100' : 'text-purple-400'
                    )}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-lg border border-pink-200 bg-white px-4 py-2 shadow-sm">
                  <div className="flex items-center gap-2 text-purple-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">CareerLotus is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>

      <div className="border-t border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your career path..."
            disabled={isLoading}
            className="flex-1 border-pink-300 focus:border-pink-400 focus:ring-pink-200"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
