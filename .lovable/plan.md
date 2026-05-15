## 변경 목적

선호 에듀테크 도구 입력을 단일 텍스트 → "하나씩 추가" 방식의 다중 입력 리스트로 변경.

## UI 동작

- 입력칸 1개 + `+ 추가` 버튼
- Enter 또는 추가 버튼 클릭 시 현재 입력값을 하단 칩(chip) 리스트에 추가, 입력칸 비움
- 각 칩에는 `×` 삭제 버튼
- 중복/공백 입력은 무시
- 최소 1개 이상 추가되어야 다음 단계 진행 가능 (기존 검증 규칙 대체)

## 데이터 모델 변경

`src/lib/types.ts`
- `preferredTool: string` → `preferredTools: string[]`

`src/lib/storage.ts` (시드 데이터)
- `preferredTool: "Khanmigo"` → `preferredTools: ["Khanmigo"]`

## 컴포넌트 수정

`src/components/survey/SurveyFlow.tsx`
- state: `preferredTool: string` → `preferredTools: string[]` + 임시 입력용 `toolDraft: string`
- step 4 UI를 입력+추가 버튼+칩 리스트 형태로 교체
- `canNext` step 4 검증: `preferredTools.length > 0 && !!evalGoal`
- 제출 payload에 `preferredTools` 사용

`src/components/consult/Dashboard.tsx`
- `data.preferredTool` → `data.preferredTools.join(", ")` (없으면 "-")

## 영향 범위

분류 로직(`classify.ts`)에는 사용되지 않으므로 점수/타입에 영향 없음.
