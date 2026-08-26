# Deployment Guide (GitHub Pages)

## 1. Prerequisites

- GitHub repository
- Node.js 20+

## 2. Local setup

```bash
cp .env.example .env
pnpm install
```

`.env` example:

```env
VITE_KAKAO_APP_KEY=your_kakao_javascript_key
```

## 3. Local verification

```bash
pnpm dev
pnpm typecheck
pnpm build
pnpm preview
```

## 4. GitHub Pages deployment

Deployment workflow is defined in `.github/workflows/pages.yml`. Push to `main` to trigger automatic deployment.

With nothing configured, the deployed site shows demo placeholder data (fictional names/date/venue/accounts). **To deploy a real invitation**, register the following under repo Settings → Secrets and variables → Actions → **Variables** tab.

Since this content is meant to be shown publicly on the deployed invitation page anyway, plain Repository Variables (not Secrets) are fine — and easier to review/update later.

- `VITE_KAKAO_APP_KEY`
- `VITE_GROOM_NAME_KR`, `VITE_GROOM_NAME_EN`, `VITE_GROOM_DISPLAY_NAME`, `VITE_GROOM_BIRTH_ORDER`, `VITE_GROOM_FATHER_NAME`, `VITE_GROOM_MOTHER_NAME`
- `VITE_BRIDE_NAME_KR`, `VITE_BRIDE_NAME_EN`, `VITE_BRIDE_DISPLAY_NAME`, `VITE_BRIDE_BIRTH_ORDER`, `VITE_BRIDE_FATHER_NAME`, `VITE_BRIDE_MOTHER_NAME`
- `VITE_WEDDING_DATE`, `VITE_WEDDING_TIME`
- `VITE_VENUE_NAME`, `VITE_VENUE_ADDRESS`, `VITE_VENUE_FULL_ADDRESS`
- `VITE_LETTER_CONTENT`
- `VITE_PAGE_TITLE`, `VITE_META_TITLE`, `VITE_META_DESCRIPTION`, `VITE_META_IMAGE`
- `VITE_ACCOUNT_GROOM_FATHER_BANK`, `VITE_ACCOUNT_GROOM_FATHER_NUMBER`, `VITE_ACCOUNT_GROOM_MOTHER_BANK`, `VITE_ACCOUNT_GROOM_MOTHER_NUMBER`, `VITE_ACCOUNT_GROOM_BANK`, `VITE_ACCOUNT_GROOM_NUMBER`
- `VITE_ACCOUNT_BRIDE_FATHER_BANK`, `VITE_ACCOUNT_BRIDE_FATHER_NUMBER`, `VITE_ACCOUNT_BRIDE_MOTHER_BANK`, `VITE_ACCOUNT_BRIDE_MOTHER_NUMBER`, `VITE_ACCOUNT_BRIDE_BANK`, `VITE_ACCOUNT_BRIDE_NUMBER`

See [`.env.example`](../.env.example) for full descriptions. Don't commit these values to `.env.example` or source code (they'd stay in git history forever) — use a local `.env` (gitignored) for development and the Repository Variables above for deployment.
