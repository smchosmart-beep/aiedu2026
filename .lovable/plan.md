# 설문 '어려움' 항목 → '수업 평가 고민'으로 교체

## 변경 요약
4단계의 **"가장 큰 어려움"** 객관식(infra/admin/design/account)을 **"수업 평가 고민"** 4가지 신유형으로 교체합니다. 중복 선택 가능, 최소 1개 필수(기존과 동일).

## 새 선택지
| key | 라벨(짧음) | 부제(상세) |
|---|---|---|
| `courseware` | AI 코스웨어 매너리즘형 | "AI 문제집만 풀려요" |
| `burnout` | 에듀테크 번아웃형 | "새로운 도구 배우기 지쳤어요" |
| `pbl` | PBL 평가 실종형 | "활동은 화려한데 평가는 주관적이에요" |
| `fragmented` | 데이터 파편화형 | "앱은 10개 쓰는데 남는 데이터가 없어요" |

ChoiceCard의 `title`에 라벨, `description`에 큰따옴표 문구를 넣어 기존 카드 톤을 유지합니다.

## 분류 로직(classify.ts) 매핑
기존 difficulties는 점수 보정에 사용 중:
- `design` 포함 → +1 (Type C 쪽으로)
- `infra`/`account`만 → -0.5 (Type A 쪽으로)

신규 항목은 "평가 고민의 깊이"를 반영해 다음과 같이 매핑합니다:
- `pbl`, `fragmented` 중 1개 이상 포함 → **+1** (평가 본질 갈증 → C 성향)
- `burnout`만 단독 선택 → **-0.5** (도구 피로 → A 성향)
- `courseware`만 단독 선택 → **0** (중립, B 성향 유지)
- 그 외 혼합 → 보정 없음

## 기술 변경 사항
1. **src/lib/types.ts**
   - `Difficulty` 유니온 교체: `"courseware" | "burnout" | "pbl" | "fragmented"`
   - (필드명 `difficulties`는 호환 위해 유지)
2. **src/components/survey/SurveyFlow.tsx**
   - `DIFF_OPTIONS` 4개 신규 항목으로 교체
   - 섹션 라벨: `가장 큰 어려움 (1개 이상 · N개)` → `수업 평가 고민 (1개 이상 · N개)`
   - 4단계 subtitle "현재 숙련도와 가장 큰 어려움 2가지" → "현재 숙련도와 수업 평가 고민"
3. **src/lib/classify.ts**
   - 새 매핑 규칙으로 `adj` 계산식 교체
4. **Dashboard 표시(있다면)**: 라벨 출력 부분이 있는지 확인 후 매핑 갱신

## 확인 필요
- 기존에 저장된 응답(localStorage)에 옛 키(`infra` 등)가 남아 있을 수 있습니다. 표시 시 알 수 없는 키는 그대로 키 문자열로 노출됩니다. **기존 응답을 어떻게 처리할지** 알려주세요:
  - (a) 무시하고 신규 응답부터 적용 (권장, 단순)
  - (b) 옛 키 → 신규 키 자동 매핑(예: design→pbl, infra/account→burnout)
  - (c) 옛 응답 일괄 삭제
