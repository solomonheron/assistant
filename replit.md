# AI Personal Assistant

## Overview

A modern personal AI assistant application built to help users manage tasks, have intelligent conversations, and personalize their productivity experience. The application features a FastAPI backend with multi-model AI support (OpenAI and Anthropic), a React frontend with shadcn/ui components, and a dual-memory system (Short-Term Memory and Long-Term Memory) for contextual conversations.

The system is designed as a utility-focused productivity tool with a clean, distraction-free interface inspired by modern apps like Linear, Notion, and ChatGPT.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework:** React with TypeScript
- **Routing:** Wouter (lightweight routing)
- **State Management:** TanStack Query (React Query) for server state
- **UI Components:** shadcn/ui with Radix UI primitives
- **Styling:** Tailwind CSS with custom design tokens
- **Build Tool:** Vite

**Design System:**
- Dark mode primary with light mode support
- Custom color palette with purple-blue accent (HSL 250 80% 65%)
- Typography: Inter for UI, JetBrains Mono for code
- Consistent elevation and hover states across components
- Mobile-responsive with breakpoint at 768px

**Component Structure:**
- Reusable UI components in `client/src/components/ui/`
- Feature components in `client/src/components/` (chat, tasks, preferences)
- Page components in `client/src/pages/`
- Custom hooks in `client/src/hooks/`

**Key Features:**
1. **Chat Interface:** Real-time WebSocket communication with AI models
2. **Task Management:** CRUD operations for tasks with completion tracking
3. **Personalization:** User preferences for communication style, theme, and language
4. **Settings:** Integration management and account settings
5. **Dashboard:** Quick actions and recent activity overview

### Backend Architecture

**Technology Stack:**
- **Framework:** FastAPI (Python)
- **ORM:** SQLAlchemy with Drizzle ORM on Node.js side
- **Database:** PostgreSQL (configured via Drizzle, using Neon serverless driver)
- **Task Queue:** Celery with Redis broker
- **AI Providers:** OpenAI and Anthropic APIs

**API Structure:**
- RESTful endpoints prefixed with `/api/`
- WebSocket endpoint at `/api/chat/ws` for real-time chat
- Auto-generated OpenAPI documentation at `/docs`
- CORS enabled for all origins (Replit-friendly)

**Multi-Model AI System:**
The backend supports three model tiers:
- **Small:** `gpt-4o-mini` - Fast, cost-effective for simple queries
- **Medium:** `gpt-4o` - Balanced performance (default)
- **Large:** `claude-sonnet-4-20250514` - Most capable, uses Anthropic

**Memory Architecture (STM/LTM):**
- **Short-Term Memory (STM):** Stores last 5 conversation exchanges (10 messages) per conversation
- **Long-Term Memory (LTM):** Persists user preferences, important facts, and personalization data
- Context building combines both STM and LTM for AI responses
- Automatic cleanup of old STM entries to maintain performance

**Database Models:**
1. `ShortTermMemory` - Recent conversation history with role, content, model used
2. `LongTermMemory` - Key-value JSON storage for persistent data
3. `Task` - Task management with title, description, completion status
4. `Preference` - User settings (communication style, theme, language)

**Service Layer Pattern:**
- `ai_service.py` - AI model interactions and response generation
- `memory_service.py` - STM/LTM management and cleanup
- `task_service.py` - Task CRUD operations

**Router Organization:**
- `chat.py` - WebSocket and chat endpoints
- `tasks.py` - Task management endpoints
- `preferences.py` - User preference endpoints
- `settings.py` - Settings and integration management
- `activity.py` - Recent activity tracking

### External Dependencies

**AI Services:**
- **OpenAI API:** Powers small and medium model responses (gpt-4o-mini, gpt-4o)
- **Anthropic API:** Powers large model responses (Claude Sonnet 4)
- API keys configured via environment variables (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`)

**Database:**
- **PostgreSQL:** Primary data store via `DATABASE_URL` environment variable
- **Neon Serverless:** PostgreSQL driver (`@neondatabase/serverless`)
- **Drizzle ORM:** TypeScript-first ORM for database operations
- Schema defined in `shared/schema.ts` with migrations in `migrations/`

**Message Queue:**
- **Redis:** Message broker for Celery task queue
- Configured via `REDIS_URL` environment variable
- Used for asynchronous task processing (email, notifications, background jobs)

**Frontend Libraries:**
- **Radix UI:** Headless component primitives for accessibility
- **TanStack Query:** Server state management and caching
- **Wouter:** Lightweight client-side routing
- **Class Variance Authority:** Type-safe variant management
- **Tailwind CSS:** Utility-first CSS framework

**Development Tools:**
- **Vite:** Fast build tool and dev server
- **TypeScript:** Type safety across frontend and shared code
- **ESBuild:** Backend bundling for production
- **TSX:** TypeScript execution for development

**Future Integration Placeholders:**
The codebase includes structured placeholders for:
- Gmail integration (email reading/sending)
- WhatsApp integration (messaging)
- Web search capabilities
- Playwright browser automation
- Calendar integration

These are designed as tool integrations in `backend/utils/tool_integrations.py` but not yet implemented.