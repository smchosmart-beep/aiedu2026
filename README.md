# AI·수학 교육 컨설팅 설문 플랫폼

초등 수학 교육 현장의 디지털 도구 활용 실태를 파악하고, 동료 교사·연구자가 **컨설팅 기록**을 남겨 함께 성장할 수 있도록 돕는 웹 애플리케이션입니다.

> 배경: AI-수학 융합 교육 및 배수판별법 기반 교수-학습 모델 연구 과정에서, 학교 현장의 기기·계정·평가 환경을 구조화해 수집하고 누적된 사례를 토대로 컨설팅을 제공하기 위한 도구로 개발되었습니다.

---

## 주요 기능

### 1. 설문 작성 (`/`)
- 지역·학교, 기기 OS/사용 형태, 계정 체계, 디지털 활용 능숙도, 어려움, 선호 도구, 평가 목표 등 다단계 설문
- 제출 시 **6자리 코드**(`ABCDE2`) 자동 발급 → 결과 페이지로 이동

### 2. 결과 열람 (`/view`)
- **코드로 바로 열기**: 발급받은 6자리 코드로 본인 설문 결과 조회
- **학교급·과목으로 찾기 (BrowseAll)**: 지역/학교명/학교급 등으로 필터링
- **키워드로 검색 (KeywordSearch)**: 어려움·도구·평가 목표 등 키워드 기반 검색
- 검색 카드는 **컨설팅 기록 수에 따라 네이비 농도**로 시각화 (0건 → 기본, 4건+ → 진한 네이비). `컨설팅 기록 (N)` 배지 표시.

### 3. 컨설팅 패널 (`ConsultationPanel`)
- 누구나 컨설턴트 이름·내용·참고 링크와 **4자리 PIN**으로 컨설팅 기록 추가
- 본인이 설정한 PIN으로만 **수정·삭제 가능** (서버에서 salt + SHA-256 해시로 검증)
- 입력 시점에 설문 코드 존재 여부를 서버에서 검증해 스팸·오염 방지

---

## 기술 스택

| 영역 | 사용 기술 |
| --- | --- |
| 프레임워크 | TanStack Start v1 (React 19, Vite 7) |
| 스타일 | Tailwind CSS v4, shadcn/ui, oklch 시멘틱 토큰 |
| 상태/데이터 | TanStack Query, TanStack Router |
| 백엔드 | Lovable Cloud (Supabase) — Postgres, RLS |
| 서버 로직 | `createServerFn` (TanStack Start 서버 함수) |
| 배포 | Cloudflare Workers (Edge) |

---

## 보안 모델

- `surveys`, `consultations` 테이블은 **RLS로 완전히 잠금**. anon/authenticated 직접 접근 불가.
- 모든 읽기·쓰기는 `service_role`을 사용하는 **서버 함수**(`src/lib/*.functions.ts`)를 통해서만 가능.
- 클라이언트로는 `pin_hash`, `pin_salt`를 노출하지 않으며, 대신 `canModify` 플래그만 전달.
- 컨설팅 PIN은 timing-safe 비교로 검증.

---

## 디렉터리 구조 (요약)

```
src/
├─ routes/                # TanStack Start 파일 기반 라우팅
│  ├─ index.tsx          # 설문 작성 (Landing → SurveyFlow)
│  ├─ view.tsx           # 결과/검색
│  └─ consult.tsx        # 코드 진입
├─ components/
│  ├─ survey/            # 설문 단계 컴포넌트
│  └─ consult/           # 결과·검색·컨설팅 패널
├─ lib/
│  ├─ surveys.functions.ts        # 설문 서버 함수
│  ├─ surveys.server.ts           # 설문 매퍼·코드 생성
│  ├─ consultations.functions.ts  # 컨설팅 CRUD + 카운트
│  ├─ consult-shade.ts            # 카드 네이비 농도 헬퍼
│  ├─ storage.ts                  # 클라이언트 측 진입점 (서버 함수 호출)
│  └─ classify.ts                 # 학교급·과목 분류
├─ integrations/supabase/         # 자동 생성 클라이언트 (편집 금지)
└─ styles.css                     # 시멘틱 디자인 토큰
```

---

## 로컬 개발

```bash
bun install
bun run dev          # 개발 서버
bun run build        # 프로덕션 빌드
bun run lint         # ESLint
```

환경 변수는 Lovable Cloud가 자동 주입합니다 (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, 서버 측 `SUPABASE_SERVICE_ROLE_KEY`).

---

## 배포

- **Preview**: <https://id-preview--fd31e57d-f83a-4e91-b40b-57d2662cafd6.lovable.app>
- **Production**: <https://aiedu2026.lovable.app>

Lovable 에디터 우측 상단 **Publish**로 배포합니다.

---

## 라이선스 / 활용

연구·교육 목적의 비영리 프로젝트입니다. 수집된 응답은 컨설팅과 교수-학습 모델 연구에 활용됩니다.
