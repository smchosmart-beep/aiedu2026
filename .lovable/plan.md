## 문제
`html2canvas@1.4.1`은 CSS `oklch()` 색상 함수를 파싱하지 못해 이미지 저장 시 에러를 던집니다. 우리 디자인 시스템은 `src/styles.css`에서 모든 토큰을 `oklch`로 정의하고 있어, 캡처 대상 카드의 배경/텍스트 모두 파싱 실패합니다.

## 해결 방향: `html-to-image`로 교체
- `html-to-image`는 SVG `foreignObject` 기반이라 브라우저 네이티브 렌더링을 사용 → `oklch`, `oklab`, `color-mix()` 모두 지원.
- API도 거의 동일하고 번들도 더 가벼움.
- shadcn 토큰을 hex로 다 바꾸는 것보다 안전하고, 디자인 시스템 일관성을 깨지 않음.

## 변경 사항
1. **의존성 교체**: `bun remove html2canvas && bun add html-to-image`
2. **`src/components/survey/CompleteCard.tsx` 수정**:
   - `html2canvas` 동적 import → `html-to-image`의 `toPng` 사용
   - `toPng(cardRef.current, { pixelRatio: 2, backgroundColor: "#ffffff" })`로 dataURL 생성 후 동일하게 다운로드
   - 에러 처리 토스트는 그대로 유지

## 검증
- `/?mode=survey`로 설문 완료 → CompleteCard에서 [이미지로 저장하기] 클릭 → PNG 다운로드 정상 동작 확인
- 콘솔 에러 0건 확인

다른 파일/로직 변경 없음. 승인 시 즉시 적용합니다.
