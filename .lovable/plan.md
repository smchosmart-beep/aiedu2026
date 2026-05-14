## 요구사항
B모드(`/consult`) 진입 시 교사지원단 확인 코드 **`2026ai`**를 먼저 입력받고, 통과해야 공유 코드 입력 화면으로 진행하도록 게이트 추가.

## 구현
1. `src/components/consult/SupportGate.tsx` 신규
   - 카드형 단일 input + "확인" 버튼 (대소문자 무시 비교)
   - 통과 시 `sessionStorage["consult:gate"]="ok"` 저장 → onUnlock 콜백으로 CodeEntry 노출
   - 실패 시 `toast.error("확인 코드가 일치하지 않습니다")`, 입력 필드 초기화
   - 좌상단 ← 홈으로
2. `src/components/consult/CodeEntry.tsx`는 그대로 유지
3. `src/routes/consult.tsx` 변경
   - `useState`로 `unlocked` 관리, 마운트 시 `sessionStorage`에서 복원
   - `unlocked` false → `<SupportGate onUnlock={...} />`
   - true → `<CodeEntry />`

## 메모
- "교사지원단만 접근" 안내 문구 + 잠금 아이콘(lucide `Lock`) 표기
- 보안 목적이 아닌 교육적 게이트이므로 클라이언트 검증으로 충분 (요구사항 부합)
- 세션 단위 유지(브라우저 닫으면 다시 입력)
