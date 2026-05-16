## 완료 화면 단순화

`src/components/survey/CompleteCard.tsx` 수정:

1. **삭제**: "아래 코드를 교사지원단에 전달해 주세요" 부제목 (`<p>`)
2. **삭제**: CONSULTING CODE 카드 전체 (`ref={cardRef}` 블록 — 코드 표시, 학교명, "2026 AI·디지털 선도학교 컨설팅" 푸터 포함)
3. **삭제**: "이미지로 저장하기" 버튼과 `saveImage` 함수, `html-to-image` 동적 import, `cardRef`, `Download` 아이콘 import

### 남는 구성
- Sparkles 아이콘
- "진단이 완료되었습니다" 제목
- "처음으로" 버튼

### 부가 정리
- 사용되지 않는 props (`code`, `schoolName`) 및 `toast`, `useRef` import 제거
- 호출처(`SurveyFlow.tsx`)에서 더 이상 필요 없는 props는 전달만 남겨도 무방하나 시그니처에 맞춰 제거

### 미변경
- DB 저장 로직(기존대로 `code` 생성·저장 — 다른 화면에서 조회용으로 사용)
- 다른 화면, 라우트
