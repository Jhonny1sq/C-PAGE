# C-PAGE — Learn C++ by doing

> Duolingo for C++. Short lessons, real compiler feedback, XP, streaks, hearts,
> and a skill tree that unlocks chapter by chapter.

C-PAGE teaches C++ through a guided loop: **read the concept → run an example →
solve a challenge → get graded by a real compiler**. Progress is saved per
lesson, XP is weighted by how cleanly you solved it, and a spaced-repetition
queue brings failed topics back.

---

## Features

- **Email/password + GitHub OAuth** authentication (Auth.js v5), bcrypt hashing,
  JWT sessions with a 30-minute access token.
- **Skill tree** learning path: Variables & Types → Control Flow → Functions →
  Arrays & Vectors → Pointers & References → OOP → STL → Templates → File I/O.
  Nodes unlock only after the previous one is completed.
- **Lesson loop**: markdown guide → read-only guided example → Monaco editor →
  progressive hints (4 levels) → test-case validation via Judge0.
- **Code execution** through Judge0 CE (70+ languages, C++ included), with a
  friendly "compiler is napping" state when the runner is down.
- **Gamification**: XP (more for fewer hints/attempts), 3 hearts per lesson, gems,
  daily streaks, confetti, and achievements.
- **Dashboard**: progress by chapter, weakest topics, achievement grid, overview
  stats, and a reset-progress action.
- **Weekly leaderboard** ranked by XP earned since Monday (UTC).
- **Spaced repetition**: failed lessons resurface on a 1/3/7/14/30-day schedule.
- Fully **responsive**, dark-themed UI built with Tailwind CSS + shadcn-style
  primitives.

---

## Tech stack

| Layer          | Choice                                                        |
| -------------- | ------------------------------------------------------------- |
| Framework      | Next.js 16 (App Router, Turbopack) + React 19 + TypeScript    |
| Styling        | Tailwind CSS v4 + shadcn-style components (`src/components/ui`) |
| Database       | PostgreSQL via Prisma ORM 7 (driver adapter `@prisma/adapter-pg`) |
| Auth           | Auth.js / NextAuth v5 (Credentials + GitHub), bcrypt          |
| Code execution | Judge0 CE (public free instance or self-hosted)               |
| Editor         | Monaco (`@monaco-editor/react`)                               |
| Validation     | Zod on every API route                                        |
| Extras         | `canvas-confetti`, `react-markdown`, `highlight.js`           |

> **Note on versions:** this project pins Prisma to the stable `7.10.0` release
> (the npm `latest` tag currently points at an 8.x release candidate). Prisma 7
> uses `prisma.config.ts`, a `prisma-client` generator with an explicit output
> path, and a driver adapter.

---

## Requirements

- **Node.js 20.9+** (Node 24 recommended)
- **PostgreSQL 14+** (local Docker, Supabase, Railway, Neon, or Prisma Postgres)
- *(Optional)* **Docker** for a local Postgres and/or a self-hosted Judge0

---

## Getting started

### 1. Clone and install

```bash
git clone <your-repo-url> c-page
cd c-page
npm install
```

`npm install` runs `prisma generate` automatically via `postinstall`.

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in at minimum `DATABASE_URL` and `AUTH_SECRET`. See
[Environment variables](#environment-variables) below.

Generate a secret:

```bash
openssl rand -base64 32
```

### 3. Set up the database

**Option A — local Postgres with Docker:**

```bash
docker run --name cpage-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=cpage \
  -p 5432:5432 -d postgres:16
```

Then in `.env.local`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cpage?schema=public"
```

**Option B — hosted (Supabase / Railway / Neon):** copy the connection string
into `DATABASE_URL`.

Apply the schema and seed the lessons:

```bash
npm run db:push      # push the schema (no migration files, quick start)
npm run db:seed      # insert chapters + lessons

# or, for a proper migration history:
npm run db:migrate -- --name init
npm run db:seed
```

### 4. Run it

```bash
npm run dev
```

Open http://localhost:3000, create an account, and start at the top of the path.

---

## Environment variables

| Variable              | Required | Description                                                                 |
| --------------------- | :------: | --------------------------------------------------------------------------- |
| `DATABASE_URL`        |    ✅    | PostgreSQL connection string.                                                |
| `AUTH_SECRET`         |    ✅    | 32-byte base64 secret for signing sessions. `openssl rand -base64 32`.       |
| `AUTH_TRUST_HOST`     |    ➖    | Set `true` when running behind a proxy / on a non-Vercel host.               |
| `AUTH_GITHUB_ID`      |    ➖    | GitHub OAuth app client ID. Omit to disable the GitHub button.              |
| `AUTH_GITHUB_SECRET`  |    ➖    | GitHub OAuth app client secret.                                             |
| `JUDGE0_API_URL`      |    ➖    | Judge0 base URL. Defaults to `https://ce.judge0.com`.                        |
| `JUDGE0_API_KEY`      |    ➖    | RapidAPI key (set together with `JUDGE0_API_HOST` for RapidAPI mode).        |
| `JUDGE0_API_HOST`     |    ➖    | RapidAPI host header.                                                        |
| `JUDGE0_CPP_LANGUAGE_ID` | ➖   | Language id for C++ (default `54` = GCC 9.2 / C++17).                        |
| `JUDGE0_TIMEOUT_MS`   |    ➖    | Per-request timeout against Judge0 (default `20000`).                        |
| `NEXT_PUBLIC_APP_URL` |    ➖    | Public app URL, used for metadata/links.                                     |

GitHub OAuth callback URL: `http://localhost:3000/api/auth/callback/github`
(and the production equivalent once deployed).

---

## Judge0 (code execution)

C-PAGE sends each submission to a Judge0 CE instance and compares stdout against
the lesson's expected output.

- **Free / quick start:** leave `JUDGE0_API_URL` as `https://ce.judge0.com`. The
  public instance is rate-limited and shared — fine for development and demos.
- **RapidAPI:** set `JUDGE0_API_URL` to the RapidAPI endpoint and provide
  `JUDGE0_API_KEY` + `JUDGE0_API_HOST`.
- **Self-hosted (recommended for production):**

  ```bash
  git clone https://github.com/judge0/judge0.git
  cd judge0
  # follow the official Docker Compose instructions, then expose port 2358
  ```

  Then set `JUDGE0_API_URL="http://your-judge0-host:2358"`.

If Judge0 cannot be reached, the lesson UI shows a **"Compiler is napping"**
panel with a retry button instead of failing silently.

---

## Scripts

| Command              | What it does                                        |
| -------------------- | --------------------------------------------------- |
| `npm run dev`        | Start the dev server (Turbopack).                    |
| `npm run build`      | `prisma generate` + production build.                |
| `npm run start`      | Start the production server.                         |
| `npm run lint`       | Run ESLint.                                          |
| `npm run db:push`    | Push the Prisma schema to the database.              |
| `npm run db:migrate` | Create and apply a migration (dev).                  |
| `npm run db:deploy`  | Apply migrations (production/CI).                    |
| `npm run db:seed`    | Seed chapters and lessons.                           |
| `npm run db:studio`  | Open Prisma Studio.                                  |

---

## Seeded content

The seed script (`prisma/seed.ts`) creates **9 chapters** and 6 fully playable
lessons (the in-between chapters are scaffolded and ready for more lessons):

1. **Variables & Types** — Declaring Variables, Types & Arithmetic
2. **Control Flow** — If/Else, For Loops
3. **Functions** — Functions
4. **Arrays & Vectors**
5. **Pointers & References** — Pointers 101
6. **OOP**, **STL**, **Templates**, **File I/O** (scaffolded)

Each lesson ships with a markdown guide, a guided example, starter + solution
code, four progressive hints, and multiple test cases (some hidden).

---

## Deployment

### Frontend → Vercel

1. Push the repo and import it at https://vercel.com/new.
2. Add the environment variables from [above](#environment-variables).
   Set `AUTH_SECRET` to a fresh 32-byte secret and set `AUTH_TRUST_HOST="true"`.
3. Build command is `npm run build` (already runs `prisma generate`).
4. Set the GitHub OAuth callback to
   `https://<your-domain>/api/auth/callback/github`.

### Database → Railway / Supabase / Neon

Create a Postgres instance, copy the connection string into `DATABASE_URL`, then
run once against production:

```bash
npm run db:deploy   # if you use migrations
npm run db:seed     # to load the lessons
```

### Judge0 → self-host

Deploy the Judge0 Docker Compose stack on any VM (Railway, Fly, a VPS) and point
`JUDGE0_API_URL` at it.

---

## Project structure

```
c-page/
├── prisma/
│   ├── schema.prisma        # data model (User, Chapter, Lesson, ...)
│   └── seed.ts              # chapters + lessons seed
├── prisma.config.ts         # Prisma 7 CLI config
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── auth/signup/route.ts
│   │   │   ├── run/route.ts          # Judge0 execution + grading
│   │   │   ├── complete/route.ts     # XP, streak, achievements
│   │   │   └── progress/route.ts     # autosave + reset
│   │   ├── learn/                    # skill tree + lesson pages
│   │   ├── dashboard/ leaderboard/ profile/
│   │   ├── login/ signup/ page.tsx
│   │   └── layout.tsx globals.css
│   ├── components/
│   │   ├── ui/                       # button, card, badge, input, ...
│   │   ├── lesson/                   # editor, output, hints, hearts, modal
│   │   ├── learning/                 # skill tree
│   │   ├── auth/ dashboard/
│   │   ├── navbar.tsx markdown.tsx
│   │   └── icons.tsx
│   ├── lib/
│   │   ├── prisma.ts judge0.ts       # infra
│   │   ├── auth helpers, validation.ts gamification.ts
│   │   ├── learning.ts achievements.ts leaderboard.ts dashboard.ts
│   │   ├── rate-limit.ts session.ts  # auth + abuse protection
│   │   └── confetti.ts utils.ts
│   ├── auth.ts                       # Auth.js config
│   ├── proxy.ts                      # route protection (Next 16 "middleware")
│   └── types/next-auth.d.ts
└── .env.example
```

---

## Security notes

- Every API route requires an authenticated session and validates input with Zod.
- Code execution is **rate-limited per user** (20 runs/minute) and rejected
  without a valid session.
- Passwords are hashed with bcrypt (cost 12). Secrets live only in env files,
  never in source.
- Route protection runs in `src/proxy.ts`; the session DB check happens in
  server components so a forged cookie cannot read data.

Broaden the rate limiter for multi-instance deployments by swapping the in-memory
store in `src/lib/rate-limit.ts` for Upstash Redis.

---

## Roadmap

- More lessons across OOP, STL, Templates, and File I/O
- Gem-powered heart refills
- Friend profiles and a follow graph
- Per-test time/memory limits and richer execution stats
- Smoother spaced-repetition scheduling (Leitner → SM-2)