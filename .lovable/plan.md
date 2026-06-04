
# 캐시 정책 조정 + 제출 직후 즉시 반영

## 변경 사항

### 1. `src/components/consult/BrowseAll.tsx`
- `useQuery(["all-responses"])` → `staleTime: 30_000`, `gcTime: 5 * 60_000`
- `useQuery(["consult-counts", codes])` → `staleTime: 30_000`

### 2. `src/components/consult/KeywordSearch.tsx`
- 동일 적용 (`staleTime: 30_000`, `gcTime: 5 * 60_000`)

### 3. `src/components/survey/SurveyFlow.tsx`
- `useQueryClient` 훅 import
- `saveResponse(r)` 성공 직후 `queryClient.invalidateQueries({ queryKey: ["all-responses"] })` 호출
- 효과: 본인이 막 등록한 설문은 즉시 목록에 반영. 다른 사용자도 다음 화면 진입 시 30초 캐시 내라면 캐시를 보지만, 새로고침 시 즉시 최신

## 동작 요약

| 상황 | 결과 |
|---|---|
| 본인이 설문 제출 후 목록 진입 | 즉시 신규 항목 표시 (캐시 무효화) |
| 다른 사용자가 30초 이내 재접속 | 캐시 사용 |
| 다른 사용자가 30초 후 접속 | 백그라운드 재요청 → 최신 |
| 누구든 새로고침(F5) | 항상 즉시 최신 |
| 200명 동시 접속 | 사용자당 30초마다 최대 1회 DB 조회 |
