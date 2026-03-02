**English** | [한국어](./README.md)

# Mobile Wedding Invitation (Node + GitHub Pages + Supabase)

This project has been migrated from FastAPI to a **Node (Vite) static app + Supabase** architecture.

## What changed

- Deployment: GitHub Pages (`/<repo>/`)
- Runtime: Node + Vite (vanilla JS)
- Kept dynamic features: RSVP / Guestbook
- Removed features: AI chatbot / photo upload / admin panel
- Operations: Supabase Dashboard

## Stack

- Frontend: Vite, Vanilla JavaScript
- Backendless: Supabase (Postgres, RLS, RPC)
- Hosting: GitHub Pages + GitHub Actions

## Quick start

### 1) Install

```bash
npm install
cp .env.example .env
```

### 2) Configure env

Set these in `.env`:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_KAKAO_APP_KEY` (optional)

### 3) Apply Supabase schema

Run SQL from:

- [`supabase/schema.sql`](./supabase/schema.sql)

### 4) Run locally

```bash
npm run dev
```

### 5) Build check

```bash
npm run build
npm run preview
```

## GitHub Pages deployment

Auto deploy is configured via `.github/workflows/pages.yml` on `main` pushes.

Required repository variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_KAKAO_APP_KEY` (optional)

See [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) for full details.

## Project layout

```text
wedding-invitation/
├── .github/workflows/pages.yml
├── config/config.json
├── public/
│   └── static/
├── src/
│   ├── lib/
│   ├── services/
│   ├── main.js
│   └── styles.css
├── supabase/
│   └── schema.sql
├── index.html
├── package.json
└── vite.config.js
```

## License

CC BY-NC-SA
