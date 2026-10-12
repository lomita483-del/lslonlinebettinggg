-- Additional editable settings used by the reconstructed Admin Settings panel.
ALTER TABLE public.app_settings
  ADD COLUMN IF NOT EXISTS signup_disabled_message text NOT NULL DEFAULT 'We''re not accepting new members at the moment, check back later or contact support',
  ADD COLUMN IF NOT EXISTS contact_discord text;
