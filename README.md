# Notebook App

A beautiful note-taking app with realistic 3D page-flipping effects, AI-powered summaries, and dynamic cover images.

## Features

- **Realistic Notebook UI** - 3D page flip animations, clean plain pages
- **Dynamic Cover Images** - Subject-matched illustrations from Unsplash
- **Markdown Support** - Bold, italic, strikethrough, links, lists, code, headings, ==highlights==
- **Text Highlighting** - Highlight important text with `==text==` syntax
- **AI Summaries** - OpenAI-powered bullet point summaries (with offline fallback)
- **Dynamic Quotes** - Inspirational quotes from API Ninjas (with database caching)
- **Offline Support** - Works offline, auto-syncs when back online
- **Multi-user** - Email/password authentication
- **Search** - Search across all notebooks or within current notebook
- **100 Pages per Notebook** - Fixed page count like real notebooks
- **Delete Notebooks** - Hover over a notebook to reveal delete button
- **Markdown Help** - Click "?" button on any page for shortcuts reference

## Subjects

- Tech Training
- AI/LLM
- Coding
- General Computer Science
- Good to Know
- Basics
- Interesting Notes
- Other (custom)

## Tech Stack

- **Next.js 16** - React framework
- **PostgreSQL** - Database
- **Prisma** - ORM
- **NextAuth** - Authentication
- **OpenAI** - AI summaries
- **Unsplash API** - Cover images
- **API Ninjas** - Quotes
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
- `OPENAI_API_KEY` - Your OpenAI API key (for AI summaries)
- `UNSPLASH_ACCESS_KEY` - From [unsplash.com/developers](https://unsplash.com/developers) (for cover images)
- `API_NINJAS_KEY` - From [api-ninjas.com](https://api-ninjas.com) (for quotes)

### 3. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### 4. Populate quotes cache (optional)

```bash
curl -X POST http://localhost:3000/api/quotes
```

### 5. Run the development server

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
   - `UNSPLASH_ACCESS_KEY`
   - `API_NINJAS_KEY`
5. Deploy! (auto-deploys on every push)

After deploy, populate quotes:
```bash
curl -X POST https://your-app.railway.app/api/quotes
```

## Keyboard Shortcuts (in editor)

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + B` | **Bold** |
| `Ctrl/Cmd + I` | *Italic* |
| `Ctrl/Cmd + K` | [Link](url) |
| `Ctrl/Cmd + `` ` `` | `Inline code` |
| `Ctrl/Cmd + H` | ==Highlight== |
| `Enter` in lists | Auto-continue list |

## Markdown Syntax

```markdown
# Heading 1
## Heading 2
**bold**
*italic*
~~strikethrough~~
==highlight==
`code`
[link](url)
- Bullet list
1. Numbered list
> Quote
```

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes (notebooks, pages, quotes, summarize, search)
│   ├── login/         # Login page
│   ├── register/      # Register page
│   ├── notebooks/     # Notebooks list & view
│   └── page.tsx       # Home (redirects)
├── components/
│   ├── auth/          # Auth forms
│   ├── editor/        # Markdown editor & preview
│   ├── notebook/      # Notebook components (cover, page, flipper)
│   └── ui/            # Reusable UI components
├── hooks/             # Custom React hooks
├── lib/               # Utilities (prisma, auth, quotes, unsplash, api-ninjas)
├── stores/            # Zustand stores
└── types/             # TypeScript types
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/notebooks` | GET | List all notebooks |
| `/api/notebooks` | POST | Create notebook |
| `/api/notebooks/[id]` | GET | Get notebook |
| `/api/notebooks/[id]` | DELETE | Delete notebook |
| `/api/pages/[id]` | PATCH | Update page content |
| `/api/search` | GET | Search notebooks |
| `/api/summarize` | POST | Generate AI summary |
| `/api/quotes` | GET | Get random quote |
| `/api/quotes` | POST | Refresh quotes cache |

## License

MIT
