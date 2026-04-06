-- Add court column to pools table
ALTER TABLE pools ADD COLUMN IF NOT EXISTS court TEXT;

-- Seed existing pools with their display_order + 1 if court is null
UPDATE pools SET court = (display_order + 1)::TEXT WHERE court IS NULL;
