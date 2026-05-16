# 컨설팅 처방전 대시보드 UI 개선 계획

## 1. 기본 모델 처방 영역 축소 (`Dashboard.tsx` 398~477줄)

- 기존 `"핵심 수업·평가 모델 처방 (기준 모델)"` Widget을 **`"기본 진단 결과"`** 로 타이틀 변경 (아이콘은 🎯 유지).
- 내부에서 **삭제**할 것:
  - 모델 정의 / 1차시 운영 흐름 / 평가 포인트 / 흔한 함정 / 다음 단계 5개 Section 전부 (436~476줄)
  - STAGES 진행 막대 (409~431줄)
  - `typeMeta.stage` 텍스트 (433줄)
- **남길 것**:
  - `Type 뱃지`: `<Badge>` 안에 `Target` 아이콘 + `typeMeta.label`(예: "Type C · 전문가형") 크게 표시
  - 점수 표기 (`점수 X.X / 5`)
  - `typeMeta.oneLiner` 1~2줄 요약만 표시
- 결과: 약 80줄짜리 위젯이 ~15줄짜리 컴팩트 카드 1개로 축소.
- 참고: `TYPE_META` 상수 자체는 `oneLiner`/`label`/`script`가 아직 일부 사용되므로 **삭제하지 않음**. 단 더 이상 참조되지 않는 `STAGES` 상수와 `Target`을 제외한 미사용 import는 정리.

## 2. AI 맞춤 처방전: Accordion 도입 (`Dashboard.tsx` 295~395줄)

- shadcn `Accordion` (`@/components/ui/accordion`)을 새로 import.
- 다음 3개 Section을 `<Accordion type="multiple">` 안의 `AccordionItem`으로 변환 (기본 닫힘 상태):
  - `수업 흐름` (flow)
  - `평가 포인트` (evaluationPoints)
  - `흔한 함정` (commonTraps)
- 각 `AccordionTrigger`에는 기존 `Section`이 보여주던 **아이콘 + 제목 + summary 한 줄**을 좌측 정렬로 노출하여 닫힌 상태에서도 핵심을 파악 가능하게 함.
- `AccordionContent`에 기존 ol/ul 리스트 본문을 그대로 렌더링.
- 상단 영역(타이틀 / 한 줄 요약 / 모델 정의)은 **항상 노출** 유지 — 모델 정의는 짧고 핵심이므로 아코디언 밖에 둠.

## 3. 현장 스크립트 카드 + 복사 기능

- AI 처방전 위젯 내부에서 `consultingScript` 카드(370~386줄)를 **아코디언 위쪽으로 이동**하여 "한 줄 요약" 바로 다음, 모델 정의보다 먼저 노출 → 컨설턴트가 가장 먼저 보게 함.
- 카드 디자인 강화:
  - 배경: `bg-blue-50 dark:bg-blue-950/30` 톤(옅은 파란색), 좌측 두꺼운 보더(`border-l-[6px] border-primary`) 유지
  - 좌상단 `MessageSquareQuote` + "현장 스크립트" 라벨 뱃지
  - 큰 따옴표(`”`) 장식 유지
- **복사 버튼** (lucide `Copy` 아이콘):
  - 위치: 카드 우상단 (`absolute top-3 right-3`)
  - `Button variant="ghost" size="icon"`
  - 클릭 시 `navigator.clipboard.writeText(consultingScript)` 후 `toast.success("현장 스크립트가 복사되었습니다!")` 호출
  - `toast`는 `sonner` 에서 import (프로젝트에 이미 `<Toaster />` 마운트되어 있다고 가정; 없으면 `__root.tsx` 확인 후 추가)
- 복사 성공 시 1.5초간 아이콘을 `Check`로 잠시 바꿔 시각적 피드백 추가.

## 기술 메모

- 수정 파일: **`src/components/consult/Dashboard.tsx` 단일 파일**.
- 신규 import: `Accordion, AccordionItem, AccordionTrigger, AccordionContent`, `Copy`, `Check`, `toast` (from `sonner`), `useState`.
- 삭제할 import: `ArrowRight` (다음 단계 박스 제거), `STAGES` 상수.
- 백엔드(서버 함수, 프롬프트, 스키마)는 **변경 없음** — 순수 프론트엔드 작업.
- `<Toaster />` 마운트 여부를 `src/routes/__root.tsx`에서 1회 확인하고, 없으면 추가하는 것까지 작업 범위에 포함.

작업 후 미리보기에서 모바일 폭(390px 가정)으로 스크롤 길이가 줄었는지, 아코디언이 부드럽게 열리는지, 복사 토스트가 정상 동작하는지 확인.
