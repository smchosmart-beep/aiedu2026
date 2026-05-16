# 수업 평가 고민에 '기타' 옵션 + 직접 입력 추가

## 변경 요약
4단계 '수업 평가 고민' 객관식에 다섯 번째 카드 **"기타"**를 추가하고, 선택 시 자유 입력 칸이 나타나도록 합니다.

## 동작
- '기타' 카드를 선택하면 아래에 텍스트 입력란(`Input`, h-14 rounded-2xl 스타일)이 펼쳐짐
- 다음 단계로 가려면 4가지 기본 옵션 중 최소 1개 선택 **또는** 기타 + 입력값(공백 제외)이 있어야 함
- 기타 카드를 해제하면 입력값도 비워짐

## 데이터 모델
- `Difficulty` 유니온에 `"other"` 추가 → `SurveyResponse.difficulties` 배열에 `"other"` 포함 가능
- `SurveyResponse`에 신규 옵셔널 필드 `otherDifficulty?: string` 추가 (자유 입력 텍스트 저장)

## 표시(Dashboard)
- `DIFF_LABEL.other = "기타"`
- 뱃지 렌더링 시 `"other"` 항목은 라벨 대신 `otherDifficulty` 텍스트(있으면)를 표시, 없으면 "기타"

## 분류 로직(classify.ts)
- `"other"`는 점수 보정 없음(중립). 기존 매핑(pbl/fragmented → +1, burnout 단독 → -0.5)은 그대로 유지하되, "burnout 단독" 판정은 길이 1 그대로 두어 other와 섞이면 보정 안 함.

## 변경 파일
1. `src/lib/types.ts` — `Difficulty`에 `"other"` 추가, `SurveyResponse.otherDifficulty?: string`
2. `src/components/survey/SurveyFlow.tsx` — DIFF_OPTIONS에 기타 추가, 입력 상태(`otherDifficulty`) 및 조건부 Input, `canNext` 갱신, submit에 필드 포함
3. `src/components/consult/Dashboard.tsx` — `DIFF_LABEL.other` 추가, 뱃지/표시에서 other일 때 자유 입력 텍스트 사용
