# 설치 가이드

## 요구사항

- Node.js 20+
- npm 10+
- Supabase 프로젝트

## 설정

```bash
npm install
cp .env.example .env
```

`.env` 값 입력:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_KAKAO_APP_KEY` (선택)

DB 스키마 적용:

- Supabase SQL Editor에서 [`/supabase/schema.sql`](../supabase/schema.sql) 실행

실행:

```bash
npm run dev
```

빌드:

```bash
npm run build
npm run preview
```
