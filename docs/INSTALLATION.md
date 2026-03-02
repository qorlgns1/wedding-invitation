# Installation

## Requirements

- Node.js 20+
- npm 10+
- Supabase project

## Setup

```bash
npm install
cp .env.example .env
```

Fill `.env` values:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_KAKAO_APP_KEY` (optional)

Apply DB schema:

- Run [`/supabase/schema.sql`](../supabase/schema.sql) in Supabase SQL Editor.

Run app:

```bash
npm run dev
```

Build app:

```bash
npm run build
npm run preview
```
