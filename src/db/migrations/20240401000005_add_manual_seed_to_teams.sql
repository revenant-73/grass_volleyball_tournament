-- Add manual_seed column to teams table for pre-pool distribution ordering
ALTER TABLE teams ADD COLUMN IF NOT EXISTS manual_seed INTEGER;
