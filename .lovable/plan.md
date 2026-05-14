# 컨설팅 매칭 대시보드 웹앱 구현 계획

## 개요
Toss 스타일의 미니멀 화이트 톤 UI로, 선도학교 교사(A모드)와 교사지원단(B모드)을 잇는 진단·처방 웹앱을 구축합니다. 데이터는 localStorage에 저장하고, 6자리 공유 코드로 두 모드를 연결합니다.

## 라우팅 구조 (TanStack Router)
- `src/routes/index.tsx` — 랜딩 페이지
  - 기본: [진단 시작하기(A)] + [공유 코드 조회(B)] 두 카드 노출
  - `?mode=survey` 진입 시 즉시 A모드 설문(Step 0)으로 라우팅, B모드 카드 숨김
- `src/routes/__root.tsx` — 토스 톤 글로벌 셸 (배경 #f7f9fc, 시스템 폰트)

A/B 화면은 단일 라우트 내 단계 state로 관리(공유 코드 URL이 핵심이라 하위 라우트 불필요), framer-motion `AnimatePresence`로 화면 전환.

## 디자인 시스템 (`src/styles.css`)
- `--primary: oklch(...)` ≈ #1B64F2 (선명 블루)
- `--background`: 거의 흰색(#fbfcfe), `--card`: 순수 white, `--muted`: #f2f4f7
- `--radius: 1rem` (rounded-2xl 기본)
- 카드: `bg-card shadow-sm rounded-2xl border border-transparent`, hover 시 `border-primary/40`
- 카드형 버튼: `whileTap={{ scale: 0.97 }}`, 선택 시 primary 보더 + 옅은 primary/5 배경
- 큰 터치 영역(min-h 64~88px), 한국어 본문 16~18px

## 컴포넌트 구조
```
src/
  routes/
    __root.tsx
    index.tsx                  // 랜딩 + ?mode=survey 분기
  components/
    Landing.tsx                // 두 진입 카드
    survey/
      SurveyFlow.tsx           // step state + AnimatePresence
      Step0Region.tsx          // 시도 17개 드롭다운 + 학교명
      Step1Device.tsx          // OS(다중) + 운용방식(단일)
      Step2Account.tsx
      Step3Skill.tsx           // 숙련도(단일) + 어려움(다중 2개 강제)
      Step4Tools.tsx           // 선호도구(단답) + 평가목표(단일)
      CompleteCard.tsx         // 6자리 코드 카드 + html2canvas 저장
      ChoiceCard.tsx           // 공용 카드형 버튼(단일/다중)
      StepShell.tsx            // 진행률 바 + 뒤로가기 + 다음
    consult/
      CodeEntry.tsx            // B모드 코드 입력
      Dashboard.tsx            // 처방 대시보드 컨테이너
      widgets/
        InfraWidget.tsx        // 위젯 1
        AdminWidget.tsx        // 위젯 2
        ModelWidget.tsx        // 위젯 3 (Type 분류)
        ScriptWidget.tsx       // 위젯 4
  lib/
    storage.ts                 // localStorage CRUD + 코드 생성
    classify.ts                // Type A/B/C 분류 로직
    seed.ts                    // TEST12 더미 시드(첫 로드 시 주입)
    types.ts                   // SurveyResponse 타입
```

## 데이터 모델 (`lib/types.ts`)
```ts
type SurveyResponse = {
  code: string;          // 6자리 [A-Z0-9]
  region: string;        // 시도
  schoolName: string;
  deviceOS: ("chromebook"|"whalebook"|"ipad"|"android"|"windows")[];
  deviceMode: "1to1"|"cart"|"mobile";
  account: "personal"|"shared"|"none";
  skill: 1|2|3|4;
  difficulties: ("infra"|"admin"|"design"|"account")[]; // 정확히 2개
  preferredTool: string;
  evalGoal: "grading"|"feedback"|"inquiry"|"agency";
  createdAt: number;
};
```

저장 키: `consult:responses` (코드→응답 맵).

## A모드 설문 플로우
- StepShell에서 상단 진행률(0/4 → 4/4), 좌상단 ←, 하단 [다음] 고정 버튼
- ChoiceCard: 라디오/체크박스 대신 큰 카드. 단일=클릭 즉시 선택+다음 활성화, 다중=클릭 토글, 다중 2개 제한 시 초과 클릭 차단 + 토스트
- Step0의 17개 시도는 shadcn `Select` (드롭다운)
- 제출 → `generateCode()` (6자리, 충돌 시 재생성) → `saveResponse()` → CompleteCard로 전환
- CompleteCard:
  - 큰 코드 카드 (예: `A8K2QM`, tracking-widest, 4xl, primary 텍스트)
  - "진단이 완료되었습니다" + 안내문구
  - **Type/처방 결과는 절대 노출 X**
  - [이미지로 저장하기] → html2canvas로 ref 영역 캡처 → PNG 다운로드 (`{학교명}_컨설팅코드.png`)

## B모드 처방 대시보드

### Type 분류 (`classify.ts`)
```
Type A: account === "none" || skill === 1
Type C: !A && account === "personal" && (skill === 3 || 4) && difficulties.includes("design")
Type B: 그 외
```

### 위젯 렌더링 규칙 (조건부)
- **위젯 1 💻 (Laptop2/Tablet 아이콘)**
  - chromebook|whalebook 포함 → 웹기반 메시지
  - ipad|android 포함 → MDM 메시지
  - deviceMode === "cart" → 10분컷 루틴 메시지
  - 해당 항목들을 카드 내 bullet로 누적 표시
- **위젯 2 📝 (FileText/UserCog 아이콘)**
  - difficulties.includes("admin") → 품의서/Quick-Start
  - account === "none" || difficulties.includes("account") → PIN 도구/보호자 동의서
- **위젯 3 🎯 (Target 아이콘)** — Type 배지(Type A/B/C) + 1단계/2단계/3단계 처방문
- **위젯 4 💬 (MessageSquareQuote 아이콘)** — Type별 현장 스크립트 박스 (큰 따옴표, 인용 스타일)

### 헤더
`[지역 뱃지] [학교명] · "컨설팅 처방전"` + 코드 작게 표시, [홈으로] 버튼

## 더미 시드 (`lib/seed.ts`)
앱 마운트 시 `TEST12` 키 부재 시 주입:
- region: "서울", schoolName: "00초등학교"
- account: "personal", skill: 4, difficulties: ["design","admin"]
  → Type C 분류 보장
- deviceOS: ["chromebook"], deviceMode: "1to1", preferredTool: "Khanmigo", evalGoal: "agency"

코드 입력 시 대소문자 무시 + 미존재 시 토스트 "유효하지 않은 코드입니다".

## 의존성 추가
```
bun add framer-motion lucide-react html2canvas
```
(shadcn/ui는 이미 구성됨 — `button`, `card`, `select`, `input`, `badge`, `sonner` 활용)

## 구현 순서
1. 의존성 설치 + styles.css 토큰 조정 (토스 톤 + #1B64F2)
2. `lib/types.ts`, `lib/storage.ts`, `lib/classify.ts`, `lib/seed.ts` 작성
3. 공용 `ChoiceCard`, `StepShell` 작성
4. Step0~4 + CompleteCard + SurveyFlow 작성 (framer-motion 전환)
5. CodeEntry + 위젯 4종 + Dashboard 작성
6. `index.tsx`에서 `?mode=survey` 분기 + 랜딩 구성
7. html2canvas 캡처 동작 + 토스트 에러 처리 검증

## 기술 메모
- 기존 placeholder index 제거
- localStorage는 SSR 시 접근 금지 → `useEffect`/`typeof window` 가드 적용
- html2canvas는 dynamic import로 클라이언트에서만 로드
- Type/처방 결과 노출 금지 규칙은 CompleteCard에서 강제(데이터를 props로 받지 않음)

승인하시면 위 순서대로 구현하겠습니다.
