-- Add columns for 3 sets scoring
ALTER TABLE matches 
ADD COLUMN team_1_score_2 INTEGER DEFAULT 0,
ADD COLUMN team_2_score_2 INTEGER DEFAULT 0,
ADD COLUMN team_1_score_3 INTEGER DEFAULT 0,
ADD COLUMN team_2_score_3 INTEGER DEFAULT 0,
ADD COLUMN sets_won_1 INTEGER DEFAULT 0,
ADD COLUMN sets_won_2 INTEGER DEFAULT 0;

-- Update existing matches to set sets_won based on the single set score if it was final
UPDATE matches 
SET sets_won_1 = CASE WHEN team_1_score > team_2_score THEN 1 ELSE 0 END,
    sets_won_2 = CASE WHEN team_2_score > team_1_score THEN 1 ELSE 0 END
WHERE status = 'final';
