# Technical Overview

**CareerLotus AI** is a full-stack web application providing personalized career counseling through an AI-driven chat interface. Built with modern technologies, it ensures real-time responsiveness, persistent data storage, and robust type safety.

---

## Architecture

- **Frontend (Next.js 15 App Router)**
  - React components for chat UI, session list, and message threads
  - shadcn/ui + Tailwind CSS for consistent styling
  - TanStack Query for data fetching and caching

- **Backend (tRPC + API Routes)**
  - tRPC procedures for chat session and message operations
  - Zod for input validation and type inference
  - Supabase-hosted PostgreSQL database read/write via Prisma ORM

- **AI Integration**
  - GOOGLE GEMINI API
  - Messages sent to AI API, responses parsed and stored in DB

- **Implemented Authentication using Supabase**

---

## Key Components

1. **Prisma Schema**
   - `User` (optional), `ChatSession`, `Message` models
   - Relationships: ChatSession ↔ Messages (1:N)
   - Indexed by timestamps for efficient queries

2. **tRPC Routers**
   - `chat.createSession`, `chat.getSessions`
   - `chat.addMessage`, `chat.getMessages`
   - `chat.generateAIResponse` integrates with AI API

3. **React Hooks & API Calls**
   - `trpc.chat.*` hooks with `useQuery` / `useMutation`
   - Optimistic updates and refetch on success

4. **Supabase & Environment**
   - `.env.local` holds `DATABASE_URL`, `OPENAI_API_KEY`, etc.
   - Direct and pooled DB connections configured in `schema.prisma`

---

## Deployment

- **Vercel** for hosting (frontend and API)
- **Environment Variables**: Set in Vercel dashboard
- **Database**: Supabase free tier with auto-scaling

---

## Security & Best Practices

- Type-safe end-to-end with TypeScript and Zod
- Environment variables in `.env.local`, excluded from Git
- Error handling in React and tRPC procedures
- Proper indexing and relational constraints in DB

---
