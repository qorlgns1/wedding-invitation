# Architecture (Node + GitHub Pages + Supabase)

## Overview

This project is a static wedding invitation app deployed on GitHub Pages.
Only two dynamic features are preserved through Supabase:

- RSVP submission
- Guestbook CRUD (password-verified edit/delete)

## Runtime Architecture

```text
Browser (GitHub Pages static app)
  ├─ UI rendering (config/config.json)
  ├─ RSVP write
  └─ Guestbook list/create/verify/update/delete
            │
            ▼
         Supabase
         ├─ Postgres tables
         ├─ RLS policies
         └─ RPC functions (password validation)
```

## Frontend

- Built with Vite + vanilla JavaScript
- Static assets are served from `public/static`
- Runtime config source is `config/config.json`
- GitHub Pages project path is handled via Vite `base` setting (`/wedding-invitation/`)

## Data Layer

### RSVP

- Table: `public.rsvp_entries`
- Access: anon/authenticated `insert` only
- RLS blocks reads from public clients

### Guestbook

- Table: `public.guestbook_entries` (includes `password_hash`)
- Public view: `public.guestbook_public_entries` (no password hash)
- RPCs:
  - `guestbook_create(name, message, password_plain)`
  - `guestbook_verify(entry_id, password_plain)`
  - `guestbook_update(entry_id, name, message, password_plain)`
  - `guestbook_delete(entry_id, password_plain)`

## Deployment

- CI/CD: `.github/workflows/pages.yml`
- Trigger: push to `main`
- Build output: `dist/`
- Hosting: GitHub Pages

## Removed Legacy Features

- FastAPI backend
- AI chatbot API
- Photo upload API
- Admin dashboard
- Visitor stats API
