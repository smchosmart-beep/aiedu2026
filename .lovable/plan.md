# 컨설팅 기록 수에 따라 카드 색상 구분

## 목표
`/view` → "학교급·과목으로 찾기"(BrowseAll) / "키워드로 검색"(KeywordSearch) 결과 카드에서, 각 설문(survey_code)에 달린 **컨설팅 기록 개수**에 따라
- 개수를 배지로 표시 ("컨설팅 기록 (N)")
- 카드 배경을 네이비 농도로 구분 (0개 → 기본, 많을수록 진해짐)

## 변경 사항

### 1. 서버 함수 추가 — `src/lib/consultations.functions.ts`
```ts
export const countConsultationsByCodes = createServerFn({ method: "POST" })
  .inputValidator(z.object({ codes: z.array(z.string().min(1).max(20)).max(1000) }).parse)
  .handler(async ({ data }): Promise<Record<string, number>> => {
    if (data.codes.length === 0) return {};
    const { data: rows, error } = await supabaseAdmin
      .from("consultations")
      .select("survey_code")
      .in("survey_code", data.codes);
    if (error) throw new Error(error.message);
    const map: Record<string, number> = {};
    for (const r of rows ?? []) {
      const k = r.survey_code as string;
      map[k] = (map[k] ?? 0) + 1;
    }
    return map;
  });
```

### 2. 디자인 토큰 — `src/styles.css`
컨설팅 강도용 네이비 스케일을 시멘틱 토큰으로 등록 (직접 색 사용 금지 원칙 준수).
```css
--consult-navy-0: var(--card);                         /* 0건 — 기본 */
--consult-navy-1: oklch(0.94 0.03 250);                /* 1건 */
--consult-navy-2: oklch(0.86 0.06 250);                /* 2건 */
--consult-navy-3: oklch(0.74 0.10 250);                /* 3건 */
--consult-navy-4: oklch(0.58 0.13 250);                /* 4건+ */
--consult-navy-fg-light: oklch(0.20 0.05 250);         /* 옅은 배경용 텍스트 */
--consult-navy-fg-dark:  oklch(0.98 0.01 250);         /* 진한 배경용 텍스트 */
```
다크 모드 블록에도 대응 톤 추가 (`:root.dark`/`.dark`).

### 3. 카드 적용 — `BrowseAll.tsx`, `KeywordSearch.tsx`
공통 헬퍼를 `src/lib/consult-shade.ts`로 분리:
```ts
export function consultShade(count: number) {
  const step = Math.min(4, count); // 0..4
  return {
    bg: `var(--consult-navy-${step})`,
    fg: step >= 3 ? `var(--consult-navy-fg-dark)` : `var(--consult-navy-fg-light)`,
  };
}
```
카드 렌더링:
- `filtered` 변경 시 `useQuery(["consult-counts", codes], () => countConsultationsByCodes({ data: { codes } }))` 로 카운트 일괄 조회
- 각 카드 `style={{ background: shade.bg, color: shade.fg }}` 적용 (배경만 토큰, 나머지 클래스는 그대로)
- 우측 chevron 옆에 배지 추가: `컨설팅 기록 ({count})`
  - 0건이면 `variant="outline"`, 1건 이상이면 `variant="secondary"` + 같은 네이비 톤

### 4. 캐시 무효화
`ConsultationPanel`에서 작성/수정/삭제 후 `queryKey: ["consult-counts"]` 도 무효화하도록 추가 → 목록 색이 즉시 갱신.

## 기술 메모
- `consultations` 테이블은 RLS로 닫혀 있어 service_role을 쓰는 서버 함수에서만 집계 가능 → 위 server fn 필수.
- 한 번에 최대 1000개 코드 조회 (현재 `listAllResponses` 도 1000건 제한과 일치).
- 색은 모두 `src/styles.css`의 시멘틱 토큰 경유 — 컴포넌트에 hex/oklch 직접 작성하지 않음.
- 다크 모드에서 가독성 유지하도록 fg 토큰 2단 사용.

## 범위 외
- 컨설팅 기록 정렬·필터(개수 기준) — 별도 요청 시 추가
- 결과 페이지(Dashboard) 내부 디자인 변경
