## 변경 목적

설문 데이터(과목·선호 도구·페인포인트·Type)를 바탕으로 AI가 생성한 **초개인화 맞춤 처방전**을 대시보드에 표시. 기존 정적 `TYPE_META` 위젯은 유지하고, 그 위에 AI 생성 위젯을 추가.

## 인프라

1. **Lovable Cloud 활성화** — Lovable AI Gateway 사용을 위해 필요(서버 함수에서 LLM 호출).
2. **Lovable AI Gateway 모델**: `google/gemini-2.5-flash` (기본, 무료 티어).

## 새 서버 함수

`src/lib/prescription.functions.ts`

- `createServerFn({ method: "POST" })`
- 입력 검증(Zod): `{ type, subject, tools[], difficulties[], evalGoal, schoolName, region, skill[], account, deviceMode }`
- `process.env.LOVABLE_API_KEY`로 `https://ai.gateway.lovable.dev/v1/chat/completions` 호출
- system 프롬프트: 사용자가 제공한 "최고 수준 수석 컨설턴트" 지시문 그대로
- user 프롬프트: 입력값을 한국어 표 형태로 정리하여 전달
- `response_format: { type: "json_object" }` 강제
- 반환: `{ title, modelDefinition, flow[], evaluationPoints[], commonTraps[], consultingScript }` 파싱 후 그대로 반환
- 429/402 에러는 사용자 친화 메시지로 매핑

## Dashboard 통합

`src/components/consult/Dashboard.tsx`

- 컴포넌트 진입 시 `useQuery(['prescription', code], ...)` 로 AI 호출
- 신규 위젯 `🤖 AI 맞춤 처방전`: 정적 모델 처방 위젯 **위쪽**에 배치
- 표시 섹션:
  - **헤드라인** (`title`)
  - **모델 정의** (`modelDefinition`)
  - **수업 흐름** (`flow[]` — 도입/탐구/평가)
  - **평가 포인트** (`evaluationPoints[]`)
  - **흔한 함정** (`commonTraps[]`)
  - **현장 스크립트** (`consultingScript` — quote 박스)
- 로딩 중: 스켈레톤 + "맞춤 처방전 작성 중…"
- 에러: "다시 생성" 버튼
- React Query `staleTime: Infinity`로 같은 code는 캐시(불필요한 LLM 재호출 방지)

## 라벨 매핑

서버 함수 호출 전 클라이언트에서 한국어 라벨로 변환:
- `account`: personal→"학생 개별 계정", shared→"교사 공용 계정", none→"계정 없음"
- `difficulties`: infra→"인프라 오류" 등 기존 매핑 사용
- `evalGoal`, `skill` 동일
- 빈 `targetSubject`인 과거 데이터는 "(미지정)"으로 처리

## 영향 범위

- 기존 정적 처방(`TYPE_META`) 그대로 유지 — 비교/검토 가능.
- 분류 로직 `classify.ts` 변경 없음.
- 기존 응답 데이터 호환성 유지(`targetSubject`, `preferredTools` 옵셔널 fallback).

## 후속 안내

Lovable Cloud 활성화 후 자동으로 `LOVABLE_API_KEY` 시크릿이 주입되며 추가 설정 불필요.
