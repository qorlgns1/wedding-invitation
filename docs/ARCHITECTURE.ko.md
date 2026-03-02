# 아키텍처 (Node + GitHub Pages + Supabase)

## 개요

이 프로젝트는 GitHub Pages에 배포되는 정적 청첩장 앱입니다.
동적 기능은 Supabase를 통해 다음 2가지만 유지합니다.

- RSVP 제출
- 방명록 CRUD (비밀번호 검증 기반 수정/삭제)

## 런타임 구조

```text
브라우저 (GitHub Pages 정적 앱)
  ├─ UI 렌더링 (config/config.json)
  ├─ RSVP 저장
  └─ 방명록 조회/작성/검증/수정/삭제
            │
            ▼
         Supabase
         ├─ Postgres 테이블
         ├─ RLS 정책
         └─ RPC 함수 (비밀번호 검증)
```

## 프런트엔드

- Vite + 바닐라 JS
- 정적 자산: `public/static`
- 런타임 설정 소스: `config/config.json`
- GitHub Pages 프로젝트 경로 대응: Vite `base` (`/wedding-invitation/`)

## 데이터 레이어

### RSVP

- 테이블: `public.rsvp_entries`
- 접근: anon/authenticated `insert`만 허용
- RLS로 공개 클라이언트의 조회 차단

### 방명록

- 테이블: `public.guestbook_entries` (`password_hash` 포함)
- 공개 뷰: `public.guestbook_public_entries` (해시 제외)
- RPC:
  - `guestbook_create(name, message, password_plain)`
  - `guestbook_verify(entry_id, password_plain)`
  - `guestbook_update(entry_id, name, message, password_plain)`
  - `guestbook_delete(entry_id, password_plain)`

## 배포

- CI/CD: `.github/workflows/pages.yml`
- 트리거: `main` 브랜치 push
- 빌드 산출물: `dist/`
- 호스팅: GitHub Pages

## 제거된 레거시 기능

- FastAPI 백엔드
- AI 챗봇 API
- 사진 업로드 API
- 관리자 페이지
- 방문자 통계 API
