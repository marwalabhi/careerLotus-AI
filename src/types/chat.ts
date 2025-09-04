export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  sessionId: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  lastMessageAt: Date;
  messageCount: number;
}
