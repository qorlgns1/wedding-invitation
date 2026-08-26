**English** | [한국어](./README.md)

# Mobile Wedding Invitation (Vite + React + TypeScript)

This project has been migrated from FastAPI to a **Vite + React + TypeScript static app**.

## What changed

- Deployment: GitHub Pages (`/<repo>/`)
- Runtime: browser-only static site
- Development/build tooling: Node.js + Vite
- UI: React + TypeScript

## Stack

- Frontend: Vite, React, TypeScript, Tailwind CSS
- Hosting: GitHub Pages + GitHub Actions

## Architecture

- `src/config`: wedding data, accounts, asset paths, feature flags
- `src/components`: cover, gallery, location, account, share, music, and other sections
- `src/hooks`: countdown, toast, scroll animation, Kakao sharing
- `src/lib`: date, path, clipboard, map, and other shared utilities
- `src/styles`: Tailwind entrypoint and design tokens

## Adding Gallery Photos

Add image files to `public/static/assets/images/wedding-snaps/`. Vite automatically creates the gallery list, so `manifest.json` does not need to be edited manually.

## Generating the Calendar Image

`scripts/generate-calendar-image.py` generates `public/static/assets/images/calendar.webp`, which is displayed in the invitation calendar section. The script keeps the date, time, calendar month, highlight color, and image size reproducible in code.

### Requirements

- Python 3
- Pillow

Install Pillow once if it is not available locally.

```bash
python3 -m pip install -r scripts/requirements.txt
```

### Run

```bash
pnpm generate:calendar
```

This overwrites the existing `public/static/assets/images/calendar.webp`. Start the dev server to check the updated image in the page.

```bash
pnpm dev
```

### Changing the Date or Design

When updating the calendar details, check these values in `scripts/generate-calendar-image.py`.

- Top Korean text: `draw_centered_text(... "2026년 8월 8일 | 오후 2시" ...)`
- Top English text: `draw_centered_text(... "Saturday, August 8, 2026 | PM 2:00" ...)`
- Calendar month: `cal.monthdayscalendar(2026, 8)`
- Highlighted day: `if day == 8`
- Output path: `OUTPUT_PATH`

After regenerating the image, commit the updated `calendar.webp`.

## Quick start

### 1) Install

```bash
pnpm install
cp .env.example .env
```

### 2) Configure env

Leaving `.env` unfilled shows demo placeholder data (fictional names/date/venue/accounts) that is never committed to the repo. To deploy this as a real invitation, fill in `.env`. See [`.env.example`](./.env.example) for the full list.

- `VITE_KAKAO_APP_KEY` (optional, Kakao share)
- `VITE_GROOM_*` / `VITE_BRIDE_*` (names, parents' names)
- `VITE_WEDDING_DATE` / `VITE_WEDDING_TIME` (ceremony date/time)
- `VITE_VENUE_*` (venue)
- `VITE_LETTER_CONTENT` (invitation letter)
- `VITE_PAGE_TITLE` / `VITE_META_*` (browser tab title, social share preview)
- `VITE_ACCOUNT_*` (bank/account number; empty pairs show a demo placeholder account)

### 3) Run locally

```bash
pnpm dev
```

### 4) Type and build checks

```bash
pnpm typecheck
pnpm build
pnpm preview
```

## GitHub Pages deployment

Auto deploy is configured via `.github/workflows/pages.yml` on `main` pushes.

See [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) for the full list of Repository Variables. Since this content is displayed publicly on the deployed page anyway, storing it as Variables (rather than Secrets) is fine.

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
