# [기본 진단 결과] 가이드 카드 추가 계획

## 변경 범위

**수정 파일**: `src/components/consult/Dashboard.tsx` 단일 파일 (프론트엔드 전용, 백엔드 변경 없음)

## 1. 타입별 가이드 데이터 상수 신설

`Dashboard.tsx` 상단(`TYPE_META` 옆)에 신규 상수 `TYPE_GUIDE` 추가:

```ts
type TypeGuide = {
  accent: string;        // tailwind 컬러 토큰 (sky / amber / violet 계열)
  bgClass: string;       // 카드 배경 (옅은 톤)
  borderClass: string;   // 좌측 보더
  headline: string;      // "AI는 '편리한 자동화 도구'다."
  target: string;        // 대상 학교 설명
  philosophyTitle: string; // "효율성과 하이터치"
  philosophyQuote: string; // "기계가 할 일은…"
  direction: string;       // 평가 혁신 방향
  keywords: string[];      // ["업무경감", "데이터진단", ...]
};

const TYPE_GUIDE: Record<TypeKey, TypeGuide> = { A: {…}, B: {…}, C: {…} };
```

내용은 사용자가 제시한 텍스트를 그대로 반영. 컬러는:
- A → sky(파랑) — 안정/도구
- B → amber(주황) — 의심/긴장
- C → violet(보라) — 깊이/전문성

## 2. [기본 진단 결과] 위젯 구조 개편

현재 위젯(약 15줄, Type 뱃지 + 점수 + oneLiner)을 다음 구조로 확장:

```
┌─ Widget "기본 진단 결과" ─────────────────────────┐
│  [Type B · 도약형]  점수 X.X / 5                  │
│  oneLiner (한 줄 요약, 기존 유지)                  │
│                                                   │
│  ┌─ 타입별 핵심 정의 카드 (TypeGuideCard) ──────┐ │
│  │  ※ 옅은 accent 배경 + 좌측 4px accent border │ │
│  │                                              │ │
│  │  [헤드라인 - 큰 폰트, bold]                  │ │
│  │  "AI는 '의심스러운 파트너'다."                │ │
│  │                                              │ │
│  │  ◆ 대상 학교 (작은 라벨)                     │ │
│  │  본문 (sm, muted)                            │ │
│  │                                              │ │
│  │  ◆ 수업 철학 — 비판적 수용                   │ │
│  │  "AI의 대답은 정답이 아니라…" (인용 스타일)    │ │
│  │                                              │ │
│  │  ◆ 평가 혁신 방향                            │ │
│  │  본문 (sm)                                   │ │
│  │                                              │ │
│  │  [#비판적사고] [#팩트체크] [#초안수정] …      │ │
│  └──────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────┘
```

## 3. 신규 헬퍼 컴포넌트 `TypeGuideCard`

파일 하단에 추가. 구조:
- 컨테이너: `rounded-2xl border-l-4 {accent border} {bg accent/5} p-5 space-y-4`
- 헤드라인: `text-lg font-bold text-foreground`
- 섹션 라벨(`대상 학교`, `수업 철학`, `평가 혁신 방향`): `text-[11px] font-semibold tracking-widest uppercase text-{accent}` + lucide 아이콘 (예: `Users`, `Quote`, `Sparkles`)
- 본문: `text-[14px] leading-relaxed text-foreground/85`
- 철학 인용문: 별도 `<blockquote>` 스타일 — `italic`, 좌측 얇은 보더, 약간 더 큰 폰트
- 키워드 영역: `flex flex-wrap gap-1.5`, 각 키워드는 shadcn `<Badge variant="secondary">` 에 `#` prefix + `rounded-full text-[12px]`

## 4. 디자인 토큰 사용 원칙

- 가능한 한 `bg-primary/5`, `border-primary/20`처럼 디자인 토큰 기반으로 표현.
- 타입별 accent는 tailwind 기본 팔레트(`sky-500`, `amber-500`, `violet-500`) 직접 사용 — 3개 타입 시각적 구분을 위한 한정 사용이며, 기존 `AlertTriangle`/`emerald-500` 등도 같은 방식으로 이미 사용 중이라 정합성 유지.

## 결과

`[기본 진단 결과]` 위젯이 단순 Type 뱃지에서 → 타입별 "철학·대상·방향·키워드"를 한 카드에서 한눈에 파악할 수 있는 가이드 카드로 확장됩니다. 컨설턴트가 현장에서 "왜 이 학교가 B인지, 어떤 관점으로 접근해야 하는지"를 즉시 설명할 수 있습니다.
