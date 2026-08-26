# GitHub Pages 배포 가이드

## 1. 사전 준비

- GitHub 저장소
- Node.js 20+

## 2. 로컬 환경 설정

```bash
cp .env.example .env
pnpm install
```

`.env` 예시:

```env
VITE_KAKAO_APP_KEY=your_kakao_javascript_key
```

## 3. 로컬 테스트

```bash
pnpm dev
pnpm typecheck
pnpm build
pnpm preview
```

## 4. GitHub Pages 배포

이 프로젝트는 `.github/workflows/pages.yml`을 사용합니다. `main` 브랜치에 push 하면 자동으로 Pages에 배포됩니다.

값을 아무것도 설정하지 않으면 데모용 예시 데이터(가상의 이름/날짜/장소/계좌)가 그대로 배포됩니다. **실제 청첩장으로 배포하려면** 저장소 Settings → Secrets and variables → Actions → **Variables** 탭에서 아래 항목을 등록하세요.

이 값들은 어차피 배포된 청첩장 페이지에 공개적으로 노출되는 내용이라(원래 그 용도) Secrets가 아닌 Variables로 등록하면 됩니다. Variables는 값 확인·수정이 쉬워 관리가 더 편합니다.

- `VITE_KAKAO_APP_KEY`
- `VITE_GROOM_NAME_KR`, `VITE_GROOM_NAME_EN`, `VITE_GROOM_DISPLAY_NAME`, `VITE_GROOM_BIRTH_ORDER`, `VITE_GROOM_FATHER_NAME`, `VITE_GROOM_MOTHER_NAME`
- `VITE_BRIDE_NAME_KR`, `VITE_BRIDE_NAME_EN`, `VITE_BRIDE_DISPLAY_NAME`, `VITE_BRIDE_BIRTH_ORDER`, `VITE_BRIDE_FATHER_NAME`, `VITE_BRIDE_MOTHER_NAME`
- `VITE_WEDDING_DATE`, `VITE_WEDDING_TIME`
- `VITE_VENUE_NAME`, `VITE_VENUE_ADDRESS`, `VITE_VENUE_FULL_ADDRESS`
- `VITE_LETTER_CONTENT`
- `VITE_PAGE_TITLE`, `VITE_META_TITLE`, `VITE_META_DESCRIPTION`, `VITE_META_IMAGE`
- `VITE_ACCOUNT_GROOM_FATHER_BANK`, `VITE_ACCOUNT_GROOM_FATHER_NUMBER`, `VITE_ACCOUNT_GROOM_MOTHER_BANK`, `VITE_ACCOUNT_GROOM_MOTHER_NUMBER`, `VITE_ACCOUNT_GROOM_BANK`, `VITE_ACCOUNT_GROOM_NUMBER`
- `VITE_ACCOUNT_BRIDE_FATHER_BANK`, `VITE_ACCOUNT_BRIDE_FATHER_NUMBER`, `VITE_ACCOUNT_BRIDE_MOTHER_BANK`, `VITE_ACCOUNT_BRIDE_MOTHER_NUMBER`, `VITE_ACCOUNT_BRIDE_BANK`, `VITE_ACCOUNT_BRIDE_NUMBER`

전체 항목 설명은 [`.env.example`](../.env.example)을 참고하세요. 이 값들을 `.env.example`이나 코드에 직접 커밋하지는 마세요 (git 히스토리에 영구히 남습니다) — 로컬에서는 `.env`(gitignore 처리됨), 배포에는 위 Repository Variables를 사용하세요.
