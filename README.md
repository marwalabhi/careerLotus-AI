# CareerLotus AI - Career Counseling Chat Application

A modern, AI-powered career counseling chat application built with Next.js, tRPC, TanStack Query, and Supabase. This application provides personalized career guidance through an intelligent chatbot interface with persistent chat history.

## 🚀 Demo

- **Live Application**: [Deployed on Vercel](https://your-app-name.vercel.app)
- **GitHub Repository**: [View Source Code](https://github.com/yourusername/careerlotus-ai)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **AI-Powered Career Counseling**: Interactive chat interface with intelligent career guidance
- **Chat Session Management**: Create new sessions and continue previous conversations
- **Message Persistence**: All conversations are saved to the database with timestamps
- **Chat History**: View and navigate through all past chat sessions
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Type-Safe API**: Full-stack type safety with tRPC and TypeScript
- **Real-time Updates**: Optimistic updates and caching with TanStack Query
- **Modern UI/UX**: Clean, intuitive interface built with shadcn/ui components

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Backend**: tRPC, Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **UI Framework**: shadcn/ui, Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **AI Integration**: OpenAI API / Together.ai
- **Authentication**: Supabase Auth (Optional)
- **Deployment**: Vercel
- **Validation**: Zod

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm, yarn, or pnpm package manager
- Supabase account (for database)
- OpenAI API key or Together.ai API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/careerlotus-ai.git
   cd careerlotus-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

### Environment Setup

1. **Copy the environment template**

   ```bash
   cp .env.example .env.local
   ```

2. **Configure your environment variables**

   ```env
   # Database (Supabase)
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

   # Supabase (Optional - for authentication)
   NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

   # AI API (Choose one)
   OPENAI_API_KEY="your-openai-api-key"
   # OR
   TOGETHER_API_KEY="your-together-ai-api-key"
   ```

3. **Set up the database**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev --name init

   # (Optional) Open Prisma Studio to view your database
   npx prisma studio
   ```

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🗄️ Database Schema

The application uses a simple, efficient database schema:

```sql
-- Users table (optional for authentication)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Chat sessions table
CREATE TABLE chat_sessions (
  id TEXT PRIMARY KEY,
  title TEXT DEFAULT 'New Chat',
  user_id TEXT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  role TEXT NOT NULL, -- 'USER' or 'ASSISTANT'
  chat_session_id TEXT REFERENCES chat_sessions(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 📡 API Documentation

### tRPC Router Endpoints

#### Chat Router (`/api/trpc/chat.*`)

- `chat.createSession` - Create a new chat session
- `chat.getSessions` - Get all chat sessions for a user
- `chat.addMessage` - Add a message to a chat session
- `chat.getMessages` - Get all messages in a session
- `chat.generateAIResponse` - Generate AI response for career counseling

#### Example Usage

```typescript
// Create a new chat session
const session = await trpc.chat.createSession.mutate({
  title: 'Career Path Discussion',
});

// Add a user message
await trpc.chat.addMessage.mutate({
  sessionId: session.id,
  content: 'What career should I choose?',
  role: 'USER',
});

// Generate AI response
const aiResponse = await trpc.chat.generateAIResponse.mutate({
  sessionId: session.id,
  message: 'What career should I choose?',
});
```

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/             # Reusable UI components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── chat-interface.tsx
│   │   ├── session-list.tsx
│   │   └── message-thread.tsx
│   ├── lib/                   # Utility functions
│   │   ├── prisma.ts          # Prisma client
│   │   └── utils.ts           # Helper functions
│   ├── server/                # tRPC server setup
│   │   ├── trpc.ts            # tRPC configuration
│   │   └── routers/
│   │       └── chat.ts        # Chat-related endpoints
│   ├── utils/                 # Client-side utilities
│   │   ├── trpc.ts            # tRPC client setup
│   │   └── db/                # Database operations
│   │       ├── chat.ts        # Chat session operations
│   │       └── message.ts     # Message operations
│   └── pages/api/trpc/        # tRPC API handlers
│       └── [trpc].ts
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── public/                    # Static assets
├── .env.local                 # Environment variables
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 💡 Usage

### Starting a New Chat Session

1. Click "New Chat" button in the sidebar
2. Type your career-related question
3. Press Enter or click Send
4. The AI will provide personalized career guidance

### Managing Chat History

- View all previous sessions in the left sidebar
- Click on any session to continue the conversation
- Sessions are automatically saved with timestamps
- Each session can be given a custom title

### AI Career Counseling Features

The AI assistant can help with:

- Career path recommendations
- Skill development guidance
- Industry insights
- Resume and interview tips
- Professional development planning

## 🚦 Testing

Run the test suite:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run end-to-end tests
npm run test:e2e
```

## 📈 Performance

- **Type Safety**: Full TypeScript coverage
- **Optimistic Updates**: Instant UI feedback with TanStack Query
- **Database Indexing**: Optimized queries for chat history
- **Caching**: Intelligent caching strategies
- **Bundle Optimization**: Code splitting and tree shaking

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect your GitHub repository to Vercel**
2. **Configure environment variables in Vercel dashboard**
3. **Deploy automatically on push to main branch**

```bash
# Or deploy manually
npm run build
npx vercel --prod
```

### Environment Variables for Production

Ensure these are set in your Vercel dashboard:

- `DATABASE_URL`
- `DIRECT_URL`
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL` (if using auth)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (if using auth)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use conventional commit messages
- Add tests for new features
- Update documentation as needed
- Ensure code passes ESLint checks

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Oration.ai](https://oration.ai) for the technical assessment opportunity
- [tRPC](https://trpc.io) for the excellent type-safe API framework
- [Supabase](https://supabase.io) for the database infrastructure
- [OpenAI](https://openai.com) for the AI API
- [Vercel](https://vercel.com) for deployment platform

## 📞 Contact

- **LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/yourprofile)
- **GitHub**: [@yourusername](https://github.com/marwalabhi)

---

**Built with ❤️ for modern web development**

> This project was created as part of a technical assessment to demonstrate full-stack development skills with modern technologies including Next.js, tRPC, TypeScript, and AI integration.
