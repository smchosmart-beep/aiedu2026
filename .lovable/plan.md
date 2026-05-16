## 변경 사항

### Dashboard.tsx
1. **"기본 진단 결과" Widget 제거** (line 234-246) — Type 진단/점수/TypeGuideCard 전체 삭제
2. **"응답 원본 보기" `<details>` 제거** (line 267-292) — 접힌 형태 폐기
3. **그 자리(현 기본 진단 결과 위치)에 새 Widget "학교 응답 정보" 배치**
   - `<Widget icon="📋" title="학교 응답 정보">` 사용
   - 2열 그리드(`sm:grid-cols-2`)로 다음 필드 깔끔 표시:
     - 공유 코드 / 제출 일시
     - 지역 / 학교명
     - 기기 OS / 기기 운용 방식
     - 에듀테크 계정 환경 / 평가 혁신 대상 과목
     - 사용중인 에듀테크 (전체 너비)
   - `Field` 컴포넌트의 라벨 톤을 살짝 정리(`text-xs text-muted-foreground` 유지, 값은 `font-medium`)
   - "가장 큰 어려움"은 아래 "학교가 체크한 고민" Widget에 이미 표시되므로 중복 제거
4. **불필요 코드 정리**
   - `classify` import 및 호출 제거
   - `TYPE_META`, `TYPE_GUIDE`, `TypeGuideCard`, `GuideRow` 컴포넌트/타입 제거
   - `Target`, `Users`, `Quote`, `Compass` lucide 아이콘 import 제거
   - 위젯 순서: 학교 응답 정보 → 학교가 체크한 고민 → ConsultationPanel → "다른 코드 조회하기"

### 미변경
- 헤더, 학교명/지역 표시, `ConsultationPanel`, 데이터 모델, 라우팅
