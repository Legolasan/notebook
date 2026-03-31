# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Next.js Version

This project uses **Next.js 16.2.1** which has breaking changes from earlier versions. Always read the relevant guide in `node_modules/next/dist/docs/` before writing new code. Heed deprecation notices.

## Common Commands

```bash
# Development
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build
npm run lint         # Run ESLint

# Database (Prisma)
npx prisma generate           # Generate Prisma client after schema changes
npx prisma migrate dev        # Create and apply migrations in development
npx prisma migrate deploy     # Apply migrations in production
npx prisma studio             # Open database GUI
```

## Environment Setup

Copy `.env.example` to `.env` and configure:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `OPENAI_API_KEY` - For AI summaries (optional - has extractive fallback)

## Architecture

### Data Flow
```
User Action → Zustand Store → API Route → Prisma → PostgreSQL
                    ↓
            LocalStorage (offline cache)
```

### Key Patterns

**Offline-First with Sync**: The app works offline by:
1. Storing notebook state in Zustand with `persist` middleware (localStorage)
2. Tracking pending changes in `pendingChanges` Map
3. Auto-syncing via `useOfflineSync` hook when back online

**100 Pages per Notebook**: Notebooks are created with exactly 100 pre-generated pages (see `src/app/api/notebooks/route.ts:58`). Pages cannot be deleted, only their content cleared.

**AI Summaries**: OpenAI generates summaries when available; falls back to extractive summarization (first 5 sentences) when offline or API unavailable (`src/app/api/summarize/route.ts`).

### State Management

Zustand store at `src/stores/notebook-store.ts`:
- `notebooks` - List of user's notebooks
- `currentNotebook` - Active notebook with pages
- `currentPageIndex` - Current page being viewed
- `pendingChanges` - Map of unsaved page changes for offline sync

### API Routes

All routes require authentication via NextAuth session:
- `POST /api/auth/register` - User registration
- `GET/POST /api/notebooks` - List/create notebooks
- `GET/PATCH/DELETE /api/notebooks/[id]` - Single notebook operations
- `PATCH /api/pages/[id]` - Update page content
- `GET /api/search?q=query&notebookId=optional` - Search across notebooks
- `POST /api/summarize` - Generate AI summary for a page

### Component Structure

**Notebook UI** (`src/components/notebook/`):
- `PageFlipper` - Handles 3D page flip animation with CSS transforms
- `NotebookPage` - Single page with editor/preview
- `NotebookCover` - Subject-themed cover display
- `SummarySidebar` - AI-generated bullet points

**Editor** (`src/components/editor/`):
- `MarkdownEditor` - Textarea with keyboard shortcuts (Ctrl+B bold, etc.)
- `MarkdownPreview` - Renders markdown with DOMPurify sanitization

### Database Schema

```
User → Notebook → Page → Summary
         ↓
    (100 pages created on notebook creation)
```

Key constraints:
- `Page` has unique constraint on `[notebookId, pageNumber]`
- Cascade delete from User → Notebook → Page → Summary

## Deployment

**Railway** - Auto-deploys on every push to the repo. No manual deployment needed.

Railway provides:
- PostgreSQL database (`DATABASE_URL` auto-configured)
- Environment variables configured in Railway dashboard
- Automatic builds and deployments on git push
