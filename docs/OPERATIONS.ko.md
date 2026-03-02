# 운영 가이드

이 프로젝트는 별도 관리자 웹 페이지를 제공하지 않습니다.
운영 작업은 Supabase Dashboard에서 수행합니다.

## RSVP

- 테이블: `rsvp_entries`
- 권장 작업: 날짜 필터 조회, CSV 내보내기

## 방명록

- 공개 조회 소스: `guestbook_public_entries`
- 수정/삭제: 사용자 비밀번호 검증 기반 RPC
- 비상 정리: Table Editor에서 직접 처리 가능

## 보안 점검

- 익명 사용자가 `rsvp_entries`를 조회할 수 없는지 확인
- 익명 사용자가 `guestbook_entries.password_hash`를 조회할 수 없는지 확인
- 방명록 수정/삭제가 올바른 비밀번호 RPC로만 가능한지 확인
