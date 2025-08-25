-- Fix over-consolidated sessions by splitting them back into proper game sessions
-- This targets sessions that have unusually high score counts indicating multiple games were merged

-- Step 1: Identify and fix sessions with too many scores (more than 6 scores suggests multiple games)
DO $$
DECLARE
  rec RECORD;
  score_rec RECORD;
  new_session_id uuid;
  scores_per_game int;
  current_game int := 1;
  score_counter int := 0;
BEGIN
  -- Find sessions with excessive scores (> 6 typically means multiple games merged)
  FOR rec IN 
    SELECT s.id as session_id, s.game_id, s.date, s.location, s.duration_minutes, s.highlights,
           COUNT(sc.id) as score_count,
           array_agg(sc.id ORDER BY sc.created_at) as score_ids
    FROM sessions s
    JOIN scores sc ON s.id = sc.session_id
    GROUP BY s.id, s.game_id, s.date, s.location, s.duration_minutes, s.highlights
    HAVING COUNT(sc.id) > 6
  LOOP
    -- Estimate scores per game (assume 3-4 players per game)
    scores_per_game := CASE 
      WHEN rec.score_count <= 8 THEN 4
      WHEN rec.score_count <= 12 THEN 3
      ELSE 4
    END;
    
    RAISE NOTICE 'Splitting session % with % scores into games of % scores each', 
      rec.session_id, rec.score_count, scores_per_game;
    
    current_game := 1;
    score_counter := 0;
    new_session_id := rec.session_id; -- Keep first session as original
    
    -- Process each score and assign to appropriate session
    FOR score_rec IN 
      SELECT sc.id as score_id, sc.created_at
      FROM scores sc 
      WHERE sc.session_id = rec.session_id
      ORDER BY sc.created_at
    LOOP
      score_counter := score_counter + 1;
      
      -- If we've reached the max scores for current game and have more scores to process
      IF score_counter > scores_per_game AND score_counter < rec.score_count THEN
        -- Create new session for next game
        INSERT INTO sessions (game_id, date, location, duration_minutes, highlights)
        VALUES (rec.game_id, rec.date, rec.location, rec.duration_minutes, rec.highlights)
        RETURNING id INTO new_session_id;
        
        current_game := current_game + 1;
        score_counter := 1;
        
        RAISE NOTICE 'Created new session % for game %', new_session_id, current_game;
      END IF;
      
      -- Move score to appropriate session
      IF new_session_id != rec.session_id THEN
        UPDATE scores 
        SET session_id = new_session_id 
        WHERE id = score_rec.score_id;
      END IF;
    END LOOP;
  END LOOP;
END $$;