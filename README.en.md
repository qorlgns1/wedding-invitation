**English** | [한국어](./README.md)

# Mobile Wedding Invitation (Vite + React + TypeScript)

This project has been migrated from FastAPI to a **Vite + React + TypeScript static app**.

## What changed

- Deployment: GitHub Pages (`/<repo>/`)
- Runtime: Node + Vite
- UI: React + TypeScript

## Stack

- Frontend: Vite, React, TypeScript
- Hosting: GitHub Pages + GitHub Actions

## Architecture

- `src/config`: wedding data, accounts, asset paths, feature flags
- `src/components`: cover, gallery, location, account, share, music, and other sections
- `src/hooks`: countdown, toast, scroll animation, Kakao sharing
- `src/lib`: date, path, clipboard, map, and other shared utilities

## Adding Gallery Photos

Add image files to `public/static/assets/images/wedding-snaps/`. Vite automatically creates the gallery list, so `manifest.json` does not need to be edited manually.

## Quick start

### 1) Install

```bash
npm install
cp .env.example .env
```

### 2) Configure env

Set this in `.env`:

- `VITE_KAKAO_APP_KEY` (optional)

### 3) Run locally

```bash
npm run dev
```

### 4) Type and build checks

```bash
npm run typecheck
npm run build
npm run preview
```

## GitHub Pages deployment

Auto deploy is configured via `.github/workflows/pages.yml` on `main` pushes.

Repository variable:

- `VITE_KAKAO_APP_KEY` (optional)

See [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) for details.

## Project layout

```text
wedding-invitation/
├── .github/workflows/pages.yml
├── public/
│   └── static/
├── src/
│   ├── components/
│   ├── config/
│   ├── hooks/
│   └── lib/
├── index.html
├── package.json
└── vite.config.js
```

## License

CC BY-NC-SA
