[English](./README.en.md) | **한국어**

# Mobile Wedding Invitation (Vite + React + TypeScript)

FastAPI 기반 청첩장 프로젝트를 **Vite + React + TypeScript 정적 사이트**로 전환한 버전입니다.

## 핵심 변경점

- 배포: GitHub Pages (`/<repo>/`)
- 런타임: Node + Vite
- UI: React + TypeScript

## 기술 스택

- Frontend: Vite, React, TypeScript, Tailwind CSS
- Hosting: GitHub Pages + GitHub Actions

## 구조

- `src/config`: 청첩장 정보, 계좌, 에셋 경로, 기능 플래그
- `src/components`: 커버, 갤러리, 지도, 계좌, 공유, 음악 등 화면 섹션
- `src/hooks`: 카운트다운, 토스트, 스크롤 애니메이션, 카카오 공유
- `src/lib`: 날짜, 경로, 클립보드, 지도 등 공통 유틸리티
- `src/styles`: Tailwind 진입점과 디자인 토큰

## 갤러리 사진 추가

`public/static/assets/images/wedding-snaps/`에 이미지 파일을 넣으면 Vite가 자동으로 갤러리 목록을 생성합니다. `manifest.json`을 직접 수정할 필요가 없습니다.

## 빠른 시작

### 1) 설치

```bash
npm install
cp .env.example .env
```

### 2) 환경변수 설정

`.env` 파일에 아래 값을 입력하세요.

- `VITE_KAKAO_APP_KEY` (선택)

### 3) 개발 서버 실행

```bash
npm run dev
```

### 4) 타입/빌드 확인

```bash
npm run typecheck
npm run build
npm run preview
```

## GitHub Pages 배포

이 저장소는 `.github/workflows/pages.yml`로 `main` push 시 자동 배포됩니다.

필요한 Repository Variables:

- `VITE_KAKAO_APP_KEY` (선택)

자세한 배포 절차는 [`docs/DEPLOYMENT.ko.md`](./docs/DEPLOYMENT.ko.md) 참고.

## 프로젝트 구조

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
