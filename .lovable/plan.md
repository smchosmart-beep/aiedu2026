## 변경 내용

`src/components/consult/Dashboard.tsx` 단 한 파일 수정 — "다시 생성" 버튼 클릭 시 로딩 스피너가 다시 나오도록 처리.

### 문제
현재 코드는 `aiQuery.isLoading` 으로 스피너를 표시하는데, 이는 **최초 1회**만 true. `refetch()` 호출 시에는 캐시 데이터가 이미 존재해서 `isLoading`이 false → 스피너 미표시 → 결과가 갑자기 갱신되어 보임.

### 수정
1. **L271**: `aiQuery.isLoading` → `aiQuery.isFetching` (재요청 시에도 true)
2. **L295**: `aiQuery.data &&` → `aiQuery.data && !aiQuery.isFetching &&` (재생성 중에는 이전 결과 숨기고 스피너만 보이도록)

다른 파일/로직은 변경하지 않음.