## 작업 내용

`src/components/survey/StepShell.tsx`에서 홈 버튼(🏠) 클릭 시 호출되는 브라우저 기본 `window.confirm()`을 shadcn의 `AlertDialog` 컴포넌트로 교체합니다.

기본 confirm 대화상자는 OS/브라우저가 그리기 때문에 도메인 주소(`...lovableproject.com에 삽입된 페이지 내용:`)가 자동으로 표시됩니다. 앱 내부 모달로 바꾸면 이 주소 노출이 사라지고, 디자인도 앱 톤에 맞게 통일됩니다.

### 변경 사항

- `useState`로 모달 열림 상태 관리
- 홈 아이콘 클릭 → `setOpen(true)`
- `AlertDialog` 표시
  - 제목: "진단을 중단할까요?"
  - 설명: "입력한 내용은 저장되지 않아요."
  - 취소 / 확인 버튼 (확인 시 `/`로 이동)
- 기존 `window.confirm` 호출 제거

### 영향 범위

- 파일 1개만 수정: `src/components/survey/StepShell.tsx`
- 기능/로직 변경 없음 (UI만 교체)
