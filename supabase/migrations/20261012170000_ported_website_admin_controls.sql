-- Ported website availability and guided tutorial controls from the E-Football admin settings.
ALTER TABLE public.app_settings
  ADD COLUMN IF NOT EXISTS maintenance_image text,
  ADD COLUMN IF NOT EXISTS closed_image text,
  ADD COLUMN IF NOT EXISTS allow_signups boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS tutorials_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS tutorials_for_new_users boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS tutorials_for_new_signins boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS tutorials_for_visitors boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.tutorial_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tour_key text NOT NULL,
  status text NOT NULL DEFAULT 'not_started'
    CHECK (status IN ('not_started', 'in_progress', 'completed', 'skipped', 'remind_later')),
  current_step integer NOT NULL DEFAULT 0 CHECK (current_step >= 0),
  remind_after timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, tour_key)
);

ALTER TABLE public.tutorial_states ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tutorial_states TO authenticated;
GRANT ALL ON public.tutorial_states TO service_role;

DO $$ BEGIN
  CREATE POLICY "Users can view own tutorial state" ON public.tutorial_states
    FOR SELECT TO authenticated USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can create own tutorial state" ON public.tutorial_states
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can update own tutorial state" ON public.tutorial_states
    FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can delete own tutorial state" ON public.tutorial_states
    FOR DELETE TO authenticated USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Super Admins can view tutorial state" ON public.tutorial_states
    FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
