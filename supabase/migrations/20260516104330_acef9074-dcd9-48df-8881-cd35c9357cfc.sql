
CREATE TABLE public.surveys (
  code TEXT PRIMARY KEY,
  region TEXT NOT NULL,
  school_name TEXT NOT NULL,
  device_os TEXT[] NOT NULL DEFAULT '{}',
  device_mode TEXT NOT NULL,
  account TEXT NOT NULL,
  skill INTEGER[] NOT NULL DEFAULT '{}',
  difficulties TEXT[] NOT NULL DEFAULT '{}',
  other_difficulty TEXT,
  difficulty_detail TEXT,
  preferred_tools TEXT[] NOT NULL DEFAULT '{}',
  target_subject TEXT NOT NULL DEFAULT '',
  eval_goal TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "surveys_public_select" ON public.surveys FOR SELECT USING (true);
CREATE POLICY "surveys_public_insert" ON public.surveys FOR INSERT WITH CHECK (true);

CREATE TABLE public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_code TEXT NOT NULL REFERENCES public.surveys(code) ON DELETE CASCADE,
  consultant_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_consultations_survey_code ON public.consultations(survey_code, created_at DESC);

ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "consultations_public_select" ON public.consultations FOR SELECT USING (true);
CREATE POLICY "consultations_public_insert" ON public.consultations FOR INSERT WITH CHECK (true);
