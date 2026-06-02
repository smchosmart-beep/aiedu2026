# 보안 수정 계획

## 목표
- `pin_hash`/`pin_salt`가 클라이언트로 절대 노출되지 않도록 차단
- `consultations`·`surveys` 테이블의 익명 SELECT/INSERT 정책 제거
- 기존 사용자 흐름(설문 작성·열람, 컨설팅 작성·수정·삭제, 키워드/학교급 검색)은 그대로 유지

## 적용 순서 (안전한 단계별)

### 1단계 — 서버 함수 추가 (DB 정책은 아직 그대로)

**`src/lib/consultations.functions.ts`** (기존 파일에 추가)
- `listConsultations({ surveyCode })`: `supabaseAdmin`으로 조회, **`pin_hash`/`pin_salt` 제외**한 컬럼만 select. 각 항목에 `canModify: boolean` 플래그 동봉.
- `createConsultation`: 기존 그대로 유지 + survey_code 존재 검증 한 줄 추가.

**`src/lib/surveys.functions.ts`** (신규)
- `createSurvey(payload)`: zod 검증 후 admin insert.
- `getSurveyByCode(code)`: 단건 조회.
- `listAllSurveys()`: 검색/필터용 전체 목록 조회.

**`src/lib/surveys.server.ts`** (신규, 헬퍼)
- DB ↔ 앱 타입 매퍼 등 공유 로직. (`tss-serverfn-split` 회피 위해 분리)

### 2단계 — 클라이언트 코드 교체 (DB는 아직 그대로 → 단계별 검증 가능)

- `src/components/consult/ConsultationPanel.tsx`: `fetchConsultations` → `useServerFn(listConsultations)`. `pin_hash` 분기 → 서버가 내려준 `canModify` 사용.
- `src/lib/storage.ts`: `listAllResponses`, 설문 저장/단건 조회 함수를 `surveys.functions.ts` 호출로 변경.
- 호출부 점검: `BrowseAll`, `KeywordSearch`, `consult/CodeEntry`, `SurveyFlow` 등.

### 3단계 — RLS 정책 변경 (마지막)

마이그레이션 SQL:
- `consultations_public_select`, `consultations_public_insert` DROP
- `surveys_public_select`, `surveys_public_insert` DROP
- anon/authenticated 직접 GRANT 회수 (service_role ALL만 유지)

이 순서면 클라이언트 직접 쿼리 경로가 사라진 뒤에 정책을 닫으므로 중간에 깨지지 않음.

### 4단계 — 검증

프리뷰에서:
- [ ] 신규 설문 작성 → 결과 페이지
- [ ] 코드로 결과 열람
- [ ] 학교급/과목 필터
- [ ] 키워드 검색
- [ ] 컨설팅 작성/수정/삭제
- [ ] 잘못된 PIN → 실패
- [ ] Network 탭 응답에 `pin_hash` 없음

`supabase--linter`로 잔여 경고 확인.

## 기술 상세

- 서버 함수 응답에서 컬럼 화이트리스트 명시(`select('id, survey_code, consultant_name, content, link_url, created_at')`) — `*` 금지.
- `.functions.ts` 파일은 `createServerFn` 선언만, 헬퍼는 `.server.ts`로 분리 (서버-fn 코드 스플리터 안전).
- React Query 키(`["consultations", surveyCode]`, `["all-responses"]`) 유지 → 캐시·무효화 동작 그대로.
- SSR 호환: `view.tsx`, `consult.tsx` loader에서 서버 함수 호출 시 `SUPABASE_SERVICE_ROLE_KEY` 이미 설정됨.

## 범위 외 (이번엔 안 함)
- 사용자 인증(로그인) 도입 — 익명 공개 흐름 유지.
- PIN 길이/잠금 정책 변경.
- IP 기반 rate limit — 후속 작업으로 별도 제안 가능.
