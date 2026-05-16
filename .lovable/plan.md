## 변경 사항 (3건 통합)

### 1. 4단계에서 "교사 숙련도" 선택 제거
**`src/components/survey/SurveyFlow.tsx`**
- `skill` 상태, `toggleSkill`, 교사 숙련도 Section 제거
- 부제목 "현재 숙련도와 수업 평가 고민" → "수업 평가 고민"
- `canNext` step 3에서 `skill.length > 0` 제거
- 제출 시 `skill: []`

**`src/components/consult/Dashboard.tsx`** — "교사 숙련도" Field 제거
**`src/lib/classify.ts`** — `skillScore` 제거, 점수식 `accountScore + adj`로 단순화

### 2. "선호 에듀테크 도구" → "사용중인 에듀테크" 라벨 변경
- `SurveyFlow.tsx` line 280 라벨 텍스트
- `Dashboard.tsx` line 301 Field label
- 변수명/DB 컬럼 유지

### 3. 5단계에서 "평가 혁신 목표" 선택 제거
**`src/components/survey/SurveyFlow.tsx`**
- `evalGoal` 상태 및 EVAL_OPTIONS Section 블록 제거 (line 324 주변)
- 부제목 "주로 쓰는 도구와 평가 혁신 방향" → "주로 쓰는 도구와 평가 혁신 과목"
- `canNext` step 4에서 `!!evalGoal` 제거
- 제출 시 `evalGoal`을 기본값(예: 첫 옵션)으로 저장하여 타입/DB 호환 유지

**`src/components/consult/Dashboard.tsx`**
- line 302 "평가 혁신 목표" Field 제거
- line 378 "평가 혁신 방향" 위젯이 evalGoal 기반이면 함께 검토하여 제거 또는 단순화

`types.ts`의 `evalGoal` 필드와 DB 컬럼은 유지 (마이그레이션 없음).
