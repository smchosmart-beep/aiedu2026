## 변경 사항

전제: **학교급은 학교명에서 자동 추정**(A안). DB 변경 없음.

### 1. `src/lib/types.ts`
- 추가:
  ```ts
  export type SchoolLevel = "elementary" | "middle" | "high" | "other";
  export const SCHOOL_LEVEL_LABEL: Record<SchoolLevel, string> = {
    elementary: "초등학교", middle: "중학교", high: "고등학교", other: "기타",
  };
  export function inferSchoolLevel(name: string): SchoolLevel {
    if (/초등/.test(name)) return "elementary";
    if (/중학/.test(name)) return "middle";
    if (/고등/.test(name)) return "high";
    return "other";
  }
  ```

### 2. `src/lib/storage.ts`
- 새 함수:
  ```ts
  export async function listAllResponses(): Promise<SurveyResponse[]>
  ```
  - `surveys` 전체 select, `created_at desc`, `rowToResponse` 매핑

### 3. `src/components/consult/BrowseAll.tsx` (신규)
- 헤더(뒤로 가기 + "전체 결과 둘러보기")
- 필터 영역:
  - **학교급** Select: 전체 / 초 / 중 / 고 / 기타
  - **과목** Select: 전체 + DB 결과에서 추출한 unique `targetSubject` (빈 값 제외, 정렬)
- 필터된 결과 카드 리스트 (학교명 · 지역 배지 · 학교급 배지 · 과목 · 제출 일시)
- 카드 클릭 → `setSelected(r)` → `<Dashboard data={r} readOnly onBack={...} />`
- 로딩/빈 상태 처리

### 4. `src/routes/view.tsx`
- 상단에 Tabs 두 개:
  - **"학교명으로 찾기"** → 기존 `<CodeEntry readOnly />`
  - **"전체 둘러보기"** → 신규 `<BrowseAll />`
- 기본 탭은 "학교명으로 찾기" (기존 동작 유지)

### 5. Landing 카드 설명 미세 수정 (선택)
- "지역·학교명 또는 과목·학교급으로 컨설팅 결과를 확인하세요"로 갱신

### 미변경
- DB 스키마, RLS, A/B 모드, 작성 권한
- Dashboard / ConsultationPanel (readOnly 그대로 사용)

### 참고
- 과목 옵션은 클라이언트에서 fetch한 전체 결과로부터 추출(데이터량이 크지 않음).
- 추후 데이터가 많아지면 server-side filtering으로 전환 가능.
