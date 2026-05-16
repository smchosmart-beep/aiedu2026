
ALTER TABLE public.consultations
  ADD COLUMN IF NOT EXISTS pin_hash text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS pin_salt text NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS consultations_survey_code_created_at_idx
  ON public.consultations (survey_code, created_at DESC);
