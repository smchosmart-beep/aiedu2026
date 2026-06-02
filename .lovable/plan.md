## 변경 사항

`src/components/Landing.tsx`의 4번째 항목(Canva 발표 자료)을 위쪽 3개 카드와 다른 **작은 보조 링크** 형태로 교체합니다.

### 디자인
- 위 3개 카드 아래, 살짝 간격을 두고 배치
- 작은 텍스트 링크 스타일:
  - 작은 외부 링크 아이콘(`ExternalLink`) + 텍스트
  - 가운데 정렬, `text-sm`, `text-muted-foreground` 기본 / hover 시 `text-primary`
  - 상단에 옅은 구분선(`border-t`)으로 본 카드들과 시각적으로 분리
- 문구: "교사지원단 OT 참석자용 · 수업 및 평가 혁신 사례 컨설팅 발표(초등) 자료 보기"
- 클릭 시 `https://canva.link/2026ai` 새 탭 열기 (`target="_blank"`, `rel="noopener noreferrer"`)

### 정리
- 직전에 `Card`에 추가했던 `external` prop과 `<a>` 분기 로직은 더 이상 필요 없으므로 제거하여 원래의 단순한 `Link` 전용 형태로 되돌립니다.
- `CardInner` 분리도 되돌려 원래 1개 컴포넌트 구조로 복원.
- 4번째 항목은 `Card` 컴포넌트를 쓰지 않고, Landing 내부에서 짧은 `<a>` 링크로 직접 렌더링.

### 영향 범위
- 파일: `src/components/Landing.tsx` 만 수정
- 컬러/토큰/다른 페이지에 영향 없음
