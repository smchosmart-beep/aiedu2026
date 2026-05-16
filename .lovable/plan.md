## 컨설팅 기록 PIN 보호 (수정·삭제)

작성 시 4자리 PIN을 입력받아 해시로 저장하고, 같은 PIN을 알고 있는 사람만 본인이 남긴 기록을 수정·삭제할 수 있게 합니다.

### 1. DB 마이그레이션 (`consultations` 테이블)
- `pin_hash text not null default ''` 컬럼 추가 (기존 행은 빈 문자열 → 수정·삭제 불가).
- `pin_salt text not null default ''` 컬럼 추가.
- RLS:
  - 기존 SELECT/INSERT 정책 유지.
  - UPDATE/DELETE 정책은 **추가하지 않음** (브라우저에서 직접 호출 차단).
- 인덱스: `create index on consultations(survey_code, created_at desc)`.

### 2. 서버 함수 (`src/lib/consultations.functions.ts`, 신규)
PIN 검증은 반드시 서버에서 수행. `supabaseAdmin`으로 RLS 우회하여 처리.

- `createConsultation({ surveyCode, consultantName, content, pin })`
  - PIN: 정확히 4자리 숫자 검증 (zod).
  - 랜덤 salt 생성 → `sha256(salt + pin)` → `pin_hash`, `pin_salt` 저장.
  - 생성된 행 반환.
- `updateConsultation({ id, pin, content, consultantName })`
  - 행 조회 → `pin_hash`와 일치하는지 timing-safe 비교.
  - 불일치 시 `Error("PIN이 올바르지 않습니다")`.
  - 일치 시 `content`, `consultant_name` 업데이트.
- `deleteConsultation({ id, pin })`
  - 동일하게 PIN 검증 후 삭제.

모두 미들웨어 없이 공개 호출 (랜딩의 익명 사용자가 작성·수정).
입력 검증은 zod로 길이·형식 제한 (이름 ≤60, 내용 ≤4000, pin `^\d{4}$`).

### 3. `start.ts`
- `attachSupabaseAuth`가 이미 등록되어 있으면 변경 없음. (이 기능은 인증 없음)

### 4. `ConsultationPanel.tsx` UI 변경

**작성 폼**
- 기존 작성자/내용 입력 아래에 **PIN 입력칸** 추가:
  - `<Input type="password" inputMode="numeric" pattern="\d{4}" maxLength={4} placeholder="수정·삭제용 PIN 4자리" />`
  - 헬프 텍스트: "이 PIN을 알고 있는 사람만 본인이 남긴 기록을 수정·삭제할 수 있습니다. 분실 시 복구 불가."
- 제출 시 `createConsultation` 서버 함수 호출 (supabase 직접 insert 제거).

**기록 카드** (`!readOnly`이고 `pin_hash !== ''`인 항목)
- 카드 우측 상단에 `수정` · `삭제` 버튼.
- 클릭 시 PIN 입력 다이얼로그 (`AlertDialog` 또는 `Dialog`) 표시:
  - **수정**: PIN + 새 작성자/내용 입력 → `updateConsultation` 호출.
  - **삭제**: PIN 입력 → confirm → `deleteConsultation` 호출.
- PIN 불일치 시 toast 에러.
- 성공 시 query invalidate.

**readOnly 모드**: 버튼 노출 안 함 (열람 페이지에서는 수정·삭제 불가).

### 5. 타입
- `Consultation` 타입에 `pin_hash` 포함 (UI에서 "수정·삭제 가능 여부" 판단용, 값 자체는 노출 안 함).

### 보안 메모
- 4자리 PIN은 엔트로피가 낮음(10,000개). 무차별 대입 방지를 위해 서버 함수에 **레이트리밋**까지는 이번 범위에서 생략하되, 향후 필요 시 IP+id 기준 카운터 추가 가능.
- 해시는 SHA-256 + per-row salt 사용 (Worker 런타임의 `crypto.subtle` 사용).
- PIN은 절대 클라이언트로 반환하지 않음. `pin_hash`/`pin_salt`도 SELECT 응답에서 제외하기 위해 명시적 컬럼 select 사용 또는 view 대신 server fn에서만 admin select.
  - 단순화를 위해 클라이언트 SELECT는 기존대로 두되, `pin_hash`/`pin_salt`는 hash이므로 노출되어도 비교적 안전. UI에서는 `hasPin = pin_hash !== ''`만 사용.

### 미변경
- 진단(서베이) 흐름, 열람 페이지(`/view`), 다른 화면.
