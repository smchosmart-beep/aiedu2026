-- 1) 익명/인증 사용자에게 직접 부여된 공개 정책 제거
DROP POLICY IF EXISTS "consultations_public_select" ON public.consultations;
DROP POLICY IF EXISTS "consultations_public_insert" ON public.consultations;
DROP POLICY IF EXISTS "surveys_public_select" ON public.surveys;
DROP POLICY IF EXISTS "surveys_public_insert" ON public.surveys;

-- 2) Data API(anon/authenticated)의 직접 권한 회수
--    서버 함수는 service_role(supabaseAdmin)을 사용하므로 영향 없음
REVOKE ALL ON public.consultations FROM anon, authenticated;
REVOKE ALL ON public.surveys FROM anon, authenticated;

-- 3) service_role은 모든 권한 유지 (서버 함수용)
GRANT ALL ON public.consultations TO service_role;
GRANT ALL ON public.surveys TO service_role;

-- 4) RLS는 켜진 상태 유지 (정책이 없으면 모든 직접 접근 거부)
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;