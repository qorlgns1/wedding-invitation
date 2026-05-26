[English](./README.en.md) | **한국어**

# Mobile Wedding Invitation (Vite + React + TypeScript)

FastAPI 기반 청첩장 프로젝트를 **Vite + React + TypeScript 정적 사이트**로 전환한 버전입니다.

## 핵심 변경점

- 배포: GitHub Pages (`/<repo>/`)
- 런타임: 브라우저 정적 사이트
- 개발/빌드 도구: Node.js + Vite
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

## 달력 이미지 생성

`scripts/generate-calendar-image.py`는 청첩장 달력 섹션에서 사용하는 `public/static/assets/images/calendar.webp`를 생성합니다. 날짜, 시간, 달력 월, 하이라이트 색상, 이미지 크기를 코드로 재현하기 위한 스크립트입니다.

### 필요 조건

- Python 3
- Pillow

Pillow가 없다면 한 번만 설치하세요.

```bash
python3 -m pip install -r scripts/requirements.txt
```

### 실행

```bash
pnpm generate:calendar
```

실행하면 기존 `public/static/assets/images/calendar.webp`를 새로 덮어씁니다. 생성 후 화면에서 확인하려면 개발 서버를 실행하세요.

```bash
pnpm dev
```

### 날짜나 디자인 변경

달력 정보를 바꿀 때는 `scripts/generate-calendar-image.py`에서 아래 값을 함께 확인하세요.

- 상단 문구: `draw_centered_text(... "2026년 8월 8일 | 오후 2시" ...)`
- 영문 문구: `draw_centered_text(... "Saturday, August 8, 2026 | PM 2:00" ...)`
- 달력 기준 월: `cal.monthdayscalendar(2026, 8)`
- 하이라이트 날짜: `if day == 8`
- 출력 경로: `OUTPUT_PATH`

이미지를 다시 생성한 뒤 `calendar.webp` 변경분을 커밋하면 됩니다.

## 빠른 시작

### 1) 설치

```bash
pnpm install
cp .env.example .env
```

### 2) 환경변수 설정

`.env` 파일에 아래 값을 입력하세요.

- `VITE_KAKAO_APP_KEY` (선택)
- `VITE_ACCOUNT_*` (선택, 실제 청첩장 배포용 계좌번호. 비워두면 마스킹)

### 3) 개발 서버 실행

```bash
pnpm dev
```

### 4) 타입/빌드 확인

```bash
pnpm typecheck
pnpm build
pnpm preview
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
