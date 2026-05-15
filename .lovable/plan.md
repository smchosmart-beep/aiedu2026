## 변경 목적

설문에 "수업 평가 혁신 대상 과목" 입력을 추가.

## UI 동작

- step 4(마지막)에서 평가 혁신 목표 위에 새 입력칸 1개 추가.
- 초등 교육 맥락에 맞는 자유 입력(예: 수학, 국어, 과학 등). 단일 텍스트.
- 1개 이상 작성해야 진단 완료 가능.

## 데이터 모델

`src/lib/types.ts`
- `SurveyResponse`에 `targetSubject: string` 필드 추가.

`src/lib/storage.ts` (시드)
- `targetSubject: "수학"` 추가.

## 컴포넌트 수정

`src/components/survey/SurveyFlow.tsx`
- state: `const [targetSubject, setTargetSubject] = useState("")`
- step 4 UI: 선호 도구 위쪽에 라벨 "평가 혁신 대상 과목" + Input 배치
- `canNext` step 4: `preferredTools.length > 0 && !!evalGoal && targetSubject.trim().length > 0`
- 제출 payload에 `targetSubject` 포함

`src/components/consult/Dashboard.tsx`
- 응답 원본 보기에 `<Field label="평가 혁신 대상 과목" value={data.targetSubject || "-"} />` 추가

## 영향 범위

- 분류 로직(`classify.ts`)에는 사용하지 않음 — 점수/타입 무관.
- 기존 저장된 응답에는 필드가 없을 수 있어 Dashboard에서 `|| "-"` fallback 처리.
