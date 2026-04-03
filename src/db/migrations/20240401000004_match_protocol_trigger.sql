-- Function to calculate match results based on set scores
CREATE OR REPLACE FUNCTION calculate_match_results()
RETURNS TRIGGER AS $$
DECLARE
    s1_w1 INTEGER := 0;
    s1_w2 INTEGER := 0;
    s2_w1 INTEGER := 0;
    s2_w2 INTEGER := 0;
    s3_w1 INTEGER := 0;
    s3_w2 INTEGER := 0;
    total_sets_1 INTEGER := 0;
    total_sets_2 INTEGER := 0;
BEGIN
    -- Set 1 Winner
    IF NEW.team_1_score > NEW.team_2_score AND (NEW.team_1_score >= 21) AND (NEW.team_1_score - NEW.team_2_score >= 2) THEN
        s1_w1 := 1;
    ELSIF NEW.team_2_score > NEW.team_1_score AND (NEW.team_2_score >= 21) AND (NEW.team_2_score - NEW.team_1_score >= 2) THEN
        s1_w2 := 1;
    END IF;

    -- Set 2 Winner
    IF NEW.team_1_score_2 > NEW.team_2_score_2 AND (NEW.team_1_score_2 >= 21) AND (NEW.team_1_score_2 - NEW.team_2_score_2 >= 2) THEN
        s2_w1 := 1;
    ELSIF NEW.team_2_score_2 > NEW.team_1_score_2 AND (NEW.team_2_score_2 >= 21) AND (NEW.team_2_score_2 - NEW.team_1_score_2 >= 2) THEN
        s2_w2 := 1;
    END IF;

    -- Set 3 Winner (Only if sets are split 1-1)
    IF (s1_w1 + s2_w1 = 1) AND (s1_w2 + s2_w2 = 1) THEN
        IF NEW.team_1_score_3 > NEW.team_2_score_3 AND (NEW.team_1_score_3 >= 15) AND (NEW.team_1_score_3 - NEW.team_2_score_3 >= 2) THEN
            s3_w1 := 1;
        ELSIF NEW.team_2_score_3 > NEW.team_1_score_3 AND (NEW.team_2_score_3 >= 15) AND (NEW.team_2_score_3 - NEW.team_1_score_3 >= 2) THEN
            s3_w2 := 1;
        END IF;
    END IF;

    -- Aggregate Sets
    NEW.sets_won_1 := s1_w1 + s2_w1 + s3_w1;
    NEW.sets_won_2 := s1_w2 + s2_w2 + s3_w2;

    -- Determine Match Winner
    IF NEW.sets_won_1 >= 2 THEN
        NEW.winner_team_id := NEW.team_1_id;
        NEW.status := 'final';
    ELSIF NEW.sets_won_2 >= 2 THEN
        NEW.winner_team_id := NEW.team_2_id;
        NEW.status := 'final';
    ELSE
        NEW.winner_team_id := NULL;
        -- If scores are entered but nobody has won 2 sets yet, keep as live
        IF (NEW.team_1_score > 0 OR NEW.team_2_score > 0) THEN
            NEW.status := 'live';
        END IF;
    END IF;

    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to run before every insert or update on matches
DROP TRIGGER IF EXISTS trg_calculate_match_results ON matches;
CREATE TRIGGER trg_calculate_match_results
BEFORE INSERT OR UPDATE OF 
    team_1_score, team_2_score, 
    team_1_score_2, team_2_score_2, 
    team_1_score_3, team_2_score_3
ON matches
FOR EACH ROW
EXECUTE FUNCTION calculate_match_results();
