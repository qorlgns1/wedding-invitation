# Deployment Guide (GitHub Pages + Supabase)

## 1. Prerequisites

- GitHub repository
- Supabase project
- Node.js 20+

## 2. Supabase setup

1. Create a Supabase project.
2. Run [`/supabase/schema.sql`](../supabase/schema.sql) in SQL Editor.
3. Copy `URL` and `publishable key` from Project Settings → API.

## 3. Local setup

```bash
cp .env.example .env
npm install
```

`.env` example:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_KAKAO_APP_KEY=your_kakao_javascript_key
```

## 4. Local verification

```bash
npm run dev
npm run build
npm run preview
```

## 5. GitHub Pages deployment

Deployment workflow is defined in `.github/workflows/pages.yml`.

Set repository variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_KAKAO_APP_KEY` (optional)

Push to `main` to trigger automatic deployment.

## 6. Operations (no admin UI)

- RSVP query/export: Supabase Table Editor
- Guestbook query/delete: Supabase Table Editor
- Policy/RPC changes: Supabase SQL Editor
