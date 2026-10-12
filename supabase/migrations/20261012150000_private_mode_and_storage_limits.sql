-- Private-site access switch and consistent 5 MB storage cap.
ALTER TABLE public.app_settings
  ADD COLUMN IF NOT EXISTS private_mode boolean NOT NULL DEFAULT false;

UPDATE storage.buckets
SET file_size_limit = 5242880;
