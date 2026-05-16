## 변경 개요

1. **진단 설문**: "수업 평가 고민" 단계에서 유형 선택과 별개로 **세부 내용 자유 기술 영역(textarea)** 을 항상 노출. 교사가 자기 학교 상황을 직접 서술.
2. **AI 처방 제거**: 공유 코드 조회 시 표시되던 "🤖 AI 맞춤 처방전" 위젯 삭제 + 관련 서버 함수 호출/사용 제거.
3. **교사지원단 컨설팅 기록**: AI 처방 자리에 지원단이 직접 컨설팅 내용을 작성·저장하는 영역 추가. 누구나 열람·작성 가능 (공개).
4. **공유 저장소 전환**: 현재 localStorage 기반이라 다른 사람은 코드로 못 찾음. 설문 응답과 컨설팅 기록을 Lovable Cloud(DB)로 옮겨 누구나 코드로 조회 가능하게 함.

---

## 데이터베이스

마이그레이션으로 두 테이블 신설 (RLS 활성화, 공개 정책):

- **`surveys`**: `code` (PK, text), `region`, `school_name`, `device_os` (text[]), `device_mode`, `account`, `skill` (int[]), `difficulties` (text[]), `other_difficulty` (text, nullable), `difficulty_detail` (text, nullable, **신규 자유 서술**), `preferred_tools` (text[]), `target_subject`, `eval_goal`, `created_at`.
- **`consultations`**: `id` (uuid PK), `survey_code` (text, FK→surveys.code), `consultant_name` (text), `content` (text), `created_at`, `updated_at`.

RLS 정책: 두 테이블 모두 `anon`·`authenticated`에 대해 SELECT/INSERT 허용. consultations는 UPDATE/DELETE 차단(append-only, 기록 보존). surveys도 INSERT만 허용.

> 보안 참고: 본 앱은 로그인 없이 운영되며 사용자 데이터는 학교명·지역 등 비민감 항목입니다. 컨설팅 기록 공개가 요구사항이므로 익명 읽기/쓰기를 허용합니다.

---

## 클라이언트 변경

### `src/lib/types.ts`
- `SurveyResponse`에 `difficultyDetail?: string` 추가.

### `src/components/survey/SurveyFlow.tsx` (3단계)
- "기타" 옵션의 인라인 입력은 유지하되, 그 아래에 **항상 표시되는 `Textarea`** 추가:
  - 라벨: "고민 세부 내용 (선택 사항 · 직접 서술)"
  - placeholder: "예) AI 코스웨어를 도입했지만 학생들이 단순 문제풀이만 반복하고, 수업 후 데이터를 어떻게 해석해 다음 차시에 반영할지 막막합니다."
  - 최소 4줄 높이, rounded-2xl.
- 제출 시 `difficultyDetail` 포함, Supabase에 insert.

### `src/lib/storage.ts`
- localStorage 경로 폐기. `saveResponse`/`getResponse`를 Supabase 호출로 교체:
  - `saveResponse(r)` → `supabase.from('surveys').insert(...)`.
  - `getResponse(code)` → `supabase.from('surveys').select().eq('code', code).maybeSingle()`. 비동기 `Promise<SurveyResponse | null>`로 변경.
- `generateCode()`는 클라이언트 랜덤 6자 유지 (충돌 시 insert 에러 catch→재시도 1회).

### `src/components/consult/CodeEntry.tsx`
- `getResponse` async 전환에 따라 로딩 상태 추가.

### `src/components/consult/Dashboard.tsx`
- "🤖 AI 맞춤 처방전" `<Widget>` 블록 + 관련 import(`useQuery`, `useServerFn`, `generatePrescription`, `Loader2`, `RefreshCw`, `Sparkles` 등 미사용분) 제거.
- 그 자리에 **`<ConsultationPanel surveyCode={data.code} />`** 신규 컴포넌트 삽입.
- "현재 겪고 있는 어려움" 위젯에 `data.difficultyDetail`이 있으면 인용문 형태로 함께 표시.

### `src/components/consult/ConsultationPanel.tsx` (신규)
- React Query로 `consultations` 목록 조회 (survey_code 기준, 최신순).
- 입력 폼: 작성자명 + 컨설팅 내용(textarea, 멀티라인). "기록 남기기" 버튼 → insert → 목록 자동 갱신.
- 각 기록 카드: 작성자, 작성일, 본문(줄바꿈 보존). append-only로 명시.
- 안내 문구: "이 컨설팅 기록은 공개되어 누구나 열람할 수 있습니다."

### `src/lib/prescription.functions.ts`
- 더 이상 호출되지 않음 → 파일 삭제.

### `src/components/consult/SupportGate.tsx`
- 그대로 유지 (코드 조회 진입 게이트).

---

## 산출물 체크리스트

- [ ] 마이그레이션 적용 (surveys, consultations + RLS)
- [ ] 설문 3단계에 자유 서술 textarea
- [ ] 설문 제출 → Supabase 저장
- [ ] 공유 코드 조회 → Supabase 조회
- [ ] Dashboard에서 AI 처방 영역 제거
- [ ] Dashboard에 컨설팅 기록 패널(공개 읽기/쓰기) 추가
- [ ] 사용하지 않게 된 `prescription.functions.ts` 삭제