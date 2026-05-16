## 변경 사항

### 1. `src/components/consult/ConsultationPanel.tsx`
- `readOnly?: boolean` prop 추가
- `readOnly === true`일 때:
  - 작성자 Input, 내용 Textarea, "기록 남기기" Button (form 블록 전체) 숨김
  - Badge 텍스트 "공개" → "열람 전용"
  - 상단 안내 문구: "이 영역은 공개되어 누구나 열람할 수 있습니다. 작성은 교사지원단 화면에서 가능합니다."

### 2. `src/components/consult/Dashboard.tsx`
- `readOnly?: boolean` prop 추가, `<ConsultationPanel readOnly={readOnly} ... />`로 전달
- 헤더 제목 라벨도 readOnly일 때 "컨설팅 결과 열람"으로 변경

### 3. `src/components/consult/CodeEntry.tsx`
- `readOnly?: boolean` prop 추가
- 헤더 라벨/안내문/제출 버튼 라벨을 readOnly에 따라 분기
  - readOnly: 헤더 "컨설팅 결과 열람", H1 "학교 결과 찾기", 안내 "지역과 학교명을 입력해 컨설팅 결과를 열람하세요"
  - 기본(write): 기존 그대로
- Dashboard 렌더 시 `readOnly` 전달

### 4. 새 라우트 `src/routes/view.tsx`
```tsx
export const Route = createFileRoute("/view")({
  component: ViewPage,
  head: () => ({ meta: [
    { title: "컨설팅 결과 열람 · 컨설팅 사전 진단" },
    { name: "description", content: "지역과 학교명으로 컨설팅 결과를 누구나 열람할 수 있습니다." },
  ]}),
});
function ViewPage() { return <CodeEntry readOnly />; }
```
- `SupportGate` 없음 → 인증 없이 누구나 접근 가능

### 5. `src/components/Landing.tsx`
- 세 번째 `Card` 추가:
  - `to="/view"`
  - tag: "공개 · 누구나"
  - title: "컨설팅 결과 열람"
  - desc: "지역과 학교명으로 우리 학교의 컨설팅 결과를 확인하세요"
  - icon: `Eye` (lucide-react) — A/B 모드와 다른 아이콘
  - `primary` 없음

### 미변경
- DB·RLS (SELECT는 이미 public)
- 작성 RLS는 그대로 (SupportGate가 UI 차원 보호) — 별도 요청 없으므로 정책 유지

### 참고
- `/view`와 `/consult` 모두 동일한 `CodeEntry` UI를 사용하지만, `readOnly` 분기로 작성 폼만 차이
