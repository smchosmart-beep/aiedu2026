## 문제
Dashboard의 "응답 원본 보기"가 내부 enum 값(`android`, `1to1`, `personal`, `admin, account`, `agency` 등)을 그대로 노출해 교사지원단이 의미를 파악하기 어렵습니다. 또 지역/학교명/제출일/공유코드는 빠져 있어 "원본"이라 부르기에 부족합니다.

## 해결 방향
모든 enum 값을 한글 라벨로 매핑하고, 누락된 메타 정보를 추가합니다.

### 변경: `src/components/consult/Dashboard.tsx`
1. 라벨 사전 추가 (컴포넌트 상단 상수)
   - `OS_LABEL`: chromebook→"크롬북", whalebook→"웨일북", ipad→"아이패드", android→"안드로이드 패드", windows→"윈도우"
   - `MODE_LABEL`: 1to1→"1인 1기기", cart→"카트 공용", mobile→"이동 수업"
   - `ACCOUNT_LABEL`: personal→"개인 계정 완료", shared→"교사 공용 계정", none→"계정 발급 불가"
   - `SKILL_LABEL`: 1→"1단계 · 제시용", 2→"2단계 · 상호작용", 3→"3단계 · 코스웨어 활용", 4→"4단계 · 융합수업 설계"
   - `DIFF_LABEL`: infra→"인프라 오류", admin→"행정 부담", design→"수업 설계 갈증", account→"계정 관리"
   - `EVAL_LABEL`: grading→"채점 시간 경감", feedback→"맞춤형 피드백", inquiry→"비판적 탐구", agency→"학생 주체성 평가"
2. "응답 원본 보기" 섹션 재구성
   - 그리드 항목: 공유 코드 / 제출 일시(`createdAt` toLocaleString ko-KR) / 지역 / 학교명 / 기기 OS(다중→쉼표) / 운용 방식 / 계정 환경 / 교사 숙련도 / 가장 큰 어려움(쉼표) / 선호 도구 / 평가 혁신 목표
   - 각 행 라벨은 회색, 값은 진한 텍스트
   - 모바일에서도 줄바꿈 자연스럽게 (grid-cols-1 sm:grid-cols-2)

기타 위젯 처방문은 변경하지 않습니다 (위젯 1·2의 코드 분기는 enum 그대로 사용 중이므로 영향 없음).

## 검증
- `TEST12` 코드로 대시보드 진입 → 응답 원본 보기 펼쳐서 한글 라벨 확인
- A모드로 새 응답 만든 뒤 동일 확인
