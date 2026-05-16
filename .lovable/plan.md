## 목표
교사지원단이 컨설팅 기록을 남길 때 외부 링크(예: Canva 보기 전용 링크)를 함께 첨부하고, 열람 시 클릭하여 새 창에서 열 수 있도록 한다.

## 데이터베이스 변경
`consultations` 테이블에 컬럼 1개 추가:
- `link_url TEXT NULL` — 첨부 링크 (없으면 NULL)

## 백엔드 (`src/lib/consultations.functions.ts`)
- Zod 스키마에 `linkUrl` 추가: 선택 입력. 입력 시 `https://` 또는 `http://`로 시작하는 URL만 허용, 최대 500자, 빈 문자열은 NULL로 정규화.
- `createConsultation` / `updateConsultation`이 `link_url`을 함께 저장.

## UI (`src/components/consult/ConsultationPanel.tsx`)

**작성 폼 (기록하기 칸 아래)**
- 본문 Textarea 아래, PIN 입력 위에 링크 입력란 1개 추가
- placeholder: "관련 링크 (선택) · 예: Canva 보기 전용 링크 https://…"
- `https://`로 시작하지 않으면 저장 버튼 비활성화(입력값이 있을 때만)

**기록 목록 표시**
- 본문 아래에 링크가 있으면 버튼/링크 형태로 노출
- 표시 예: `🔗 첨부 링크 열기` — 클릭 시 `target="_blank"`, `rel="noopener noreferrer nofollow"`로 새 탭
- 표시 URL의 호스트명만 작게 함께 보여 줘 어디로 가는지 미리 알 수 있게 함 (예: `canva.com`)

**수정 다이얼로그**
- 동일한 링크 입력란 추가, 기존 값을 채워 둠. 비우고 저장하면 링크 제거.

## 타입
`Consultation` 타입에 `link_url: string | null` 추가.

## 보안 고려
- 서버에서 `http(s)://`만 허용 → `javascript:` 등 XSS URL 차단
- 렌더링은 항상 `<a href>` 텍스트 링크로만 (이미지/iframe 임베드 없음)
- `rel="noopener noreferrer nofollow"`로 탭 하이재킹/SEO 영향 차단

## 영향 범위
- DB: `consultations` 테이블에 `link_url` 컬럼 추가
- 코드: `consultations.functions.ts`, `ConsultationPanel.tsx`
- 기존 기록(링크 없음)은 NULL로 그대로 표시되며 호환됨