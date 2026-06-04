CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_surveys_region_school_name
  ON public.surveys (region, school_name);

CREATE INDEX IF NOT EXISTS idx_surveys_school_name_trgm
  ON public.surveys USING gin (school_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_surveys_created_at
  ON public.surveys (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_consultations_survey_code
  ON public.consultations (survey_code);

CREATE INDEX IF NOT EXISTS idx_consultations_survey_code_created_at
  ON public.consultations (survey_code, created_at DESC);