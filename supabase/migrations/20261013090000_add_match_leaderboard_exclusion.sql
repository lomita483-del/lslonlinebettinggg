-- Explicitly separate admin archiving from leaderboard exclusion.
ALTER TABLE public.matches
  ADD COLUMN IF NOT EXISTS exclude_from_leaderboard boolean NOT NULL DEFAULT false;

NOTIFY pgrst, 'reload schema';
