[English](./README.en.md) | **한국어**

# Mobile Wedding Invitation (Node + GitHub Pages + Supabase)

FastAPI 기반 청첩장 프로젝트를 **Node(Vite) 정적 사이트 + Supabase** 구조로 전환한 버전입니다.

## 핵심 변경점

- 배포: GitHub Pages (`/<repo>/`)
- 런타임: Node + Vite (vanilla JS)
- 동적 기능: RSVP / 방명록만 유지
- 비핵심 기능: 사진 업로드 / 관리자 페이지 제거
- 운영: Supabase 대시보드

## 기술 스택

- Frontend: Vite, Vanilla JavaScript
- Backendless: Supabase (Postgres, RLS, RPC)
- Hosting: GitHub Pages + GitHub Actions

## 빠른 시작

### 1) 설치

```bash
npm install
cp .env.example .env
```

### 2) 환경변수 설정

`.env` 파일에 아래 값을 입력하세요.

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_KAKAO_APP_KEY` (선택)

### 3) Supabase 스키마 적용

Supabase SQL Editor에서 아래 파일 실행:

- [`supabase/schema.sql`](./supabase/schema.sql)

### 4) 개발 서버 실행

```bash
npm run dev
```

### 5) 빌드 확인

```bash
npm run build
npm run preview
```

## GitHub Pages 배포

이 저장소는 `.github/workflows/pages.yml`로 `main` push 시 자동 배포됩니다.

필요한 Repository Variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_KAKAO_APP_KEY` (선택)

자세한 배포 절차는 [`docs/DEPLOYMENT.ko.md`](./docs/DEPLOYMENT.ko.md) 참고.

## 프로젝트 구조

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