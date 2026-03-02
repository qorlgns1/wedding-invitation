# GitHub Pages + Supabase 배포 가이드

## 1. 사전 준비

- GitHub 저장소
- Supabase 프로젝트
- Node.js 20+

## 2. Supabase 설정

1. Supabase 프로젝트 생성
2. SQL Editor에서 [`/supabase/schema.sql`](../supabase/schema.sql) 실행
3. Project Settings → API에서 `URL`, `publishable key` 확인

## 3. 로컬 환경 설정

```bash
cp .env.example .env
npm install
```

`.env` 예시:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_KAKAO_APP_KEY=your_kakao_javascript_key
```

## 4. 로컬 테스트

```bash
npm run dev
npm run build
npm run preview
```

## 5. GitHub Pages 배포

이 프로젝트는 `.github/workflows/pages.yml`을 사용합니다.

Repository Variables 설정:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_KAKAO_APP_KEY` (선택)

`main` 브랜치에 push 하면 자동으로 Pages에 배포됩니다.

## 6. 운영 (관리자 UI 없음)

- RSVP 데이터 조회/내보내기: Supabase Table Editor
- 방명록 조회/삭제: Supabase Table Editor
- 정책/RPC 수정: Supabase SQL Editor
