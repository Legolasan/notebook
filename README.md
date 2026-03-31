# Notebook App

A beautiful note-taking app with realistic 3D page-flipping effects and AI-powered summaries.

## Features

- **Realistic Notebook UI** - 3D page flip animations, notebook covers by subject
- **Markdown Support** - Bold, italic, strikethrough, links, lists, code, headings
- **AI Summaries** - OpenAI-powered bullet point summaries (with offline fallback)
- **Offline Support** - Works offline, auto-syncs when back online
- **Multi-user** - Email/password authentication
- **Search** - Search across all notebooks or within current notebook
- **100 Pages per Notebook** - Fixed page count like real notebooks
- **No Delete** - Strikethrough only, like real notebooks!
- **Motivational Quotes** - Random funny motivational quotes in page footers

## Tech Stack

- **Next.js** - React framework
- **PostgreSQL** - Database
- **Prisma** - ORM
- **NextAuth** - Authentication
- **OpenAI** - AI summaries
- **Tailwind CSS** - Styling
- **Zustand** - State management

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Update the following:
- `DATABASE_URL` - Your PostgreSQL connection string
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `OPENAI_API_KEY` - Your OpenAI API key

### 3. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy to Railway

1. Create a new project on [Railway](https://railway.app)
2. Add a PostgreSQL database
3. Connect your GitHub repo
4. Set environment variables:
   - `DATABASE_URL` (auto-set by Railway PostgreSQL)
   - `NEXTAUTH_URL` (your Railway app URL)
   - `NEXTAUTH_SECRET`
   - `OPENAI_API_KEY`
5. Deploy!

## Keyboard Shortcuts (in editor)

- `Ctrl/Cmd + B` - Bold
- `Ctrl/Cmd + I` - Italic
- `Ctrl/Cmd + K` - Link
- `Ctrl/Cmd + \`` - Inline code
- `Enter` in lists - Auto-continue list

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   ├── login/         # Login page
│   ├── register/      # Register page
│   ├── notebooks/     # Notebooks list & view
│   └── page.tsx       # Home (redirects)
├── components/
│   ├── auth/          # Auth forms
│   ├── editor/        # Markdown editor
│   ├── notebook/      # Notebook components
│   └── ui/            # Reusable UI components
├── hooks/             # Custom React hooks
├── lib/               # Utilities (prisma, auth, quotes)
├── stores/            # Zustand stores
└── types/             # TypeScript types
```

## License

MIT
