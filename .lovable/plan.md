## 변경 사항

### 1. `src/lib/storage.ts`
- 새 함수 추가:
  ```ts
  export async function findResponsesBySchool(
    region: string, schoolName: string
  ): Promise<SurveyResponse[]>
  ```
  - `supabase.from("surveys").select("*").eq("region", region).ilike("school_name", `%${trim}%`).order("created_at", { ascending: false })`
  - 결과를 `rowToResponse`로 매핑하여 반환
- 기존 `getResponse(code)`는 그대로 유지 (내부 PK 조회용)

### 2. `src/components/consult/CodeEntry.tsx` — 전면 개편
- 헤더 라벨 "공유 코드 조회" → **"컨설팅 학교 찾기"**
- 6자리 코드 입력 폼 제거. 대신:
  - **지역 Select** (`REGIONS` 사용) — 필수
  - **학교명 Input** — 필수, 부분 일치 허용
  - "찾기" 버튼 (`PencilLine` 또는 `Search` 아이콘 유지)
- 제출 시 `findResponsesBySchool` 호출:
  - **0건**: `toast.error("일치하는 학교 응답이 없습니다")`
  - **1건**: 바로 `<Dashboard data={...} />` 렌더
  - **여러 건**: 응답 카드 리스트로 표시
    (학교명 · 제출 일시 · 지역 배지). 카드 클릭 시 해당 응답으로 Dashboard 진입.
- 상단 안내 문구: "지역과 학교명을 입력해 학교 응답을 찾아 컨설팅을 기록하세요"
- `Search`/돋보기 아이콘은 그대로 사용해도 무방하지만, 헤더 아이콘은 제거하고 폼 위에 작은 안내 카드 형태로 정리

### 3. 미변경
- `surveys.code` 컬럼·`generateCode`·`saveResponse` 및 `CompleteCard`의 코드 표시 (DB 식별자로 계속 사용)
- `Dashboard.tsx`, `ConsultationPanel.tsx` — `surveyCode` prop은 내부 식별자로 그대로 사용

### 참고
- 동일 학교가 여러 번 설문을 제출하면 모두 보이므로 교사지원단이 제출 일시로 구분 가능
- DB 인덱스 추가는 현 데이터량 기준 불필요 (필요 시 추후 마이그레이션)
