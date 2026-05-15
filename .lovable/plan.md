## 변경 목적

"가장 큰 어려움" 선택 제약을 "정확히 2개"에서 "1개 이상(상한 없음)"으로 완화.

## 수정 파일

`src/components/survey/SurveyFlow.tsx`

1. **`toggleDiff`**: 2개 상한 제한 및 토스트 제거 → 단순 토글로 변경.
2. **검증 (`canNext` step 3)**: `difficulties.length === 2` → `difficulties.length >= 1`.
3. **섹션 라벨**: `가장 큰 어려움 (정확히 2개 · {n}/2)` → `가장 큰 어려움 (1개 이상 · {n}개)`.

## 영향 범위

- `classify.ts`의 어려움 보정 로직(`hasDesign`, `onlyInfraOrAccount`)은 배열 내용 기반이라 그대로 동작.
- 데이터 모델/저장 구조 변경 없음.
