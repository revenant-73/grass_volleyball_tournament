-- Add format_type to pools to handle mixed formats like the 7-team special case
ALTER TABLE pools ADD COLUMN IF NOT EXISTS format_type TEXT;
