-- This migration consolidates over-split sessions where a single game play
-- was incorrectly split into multiple sessions (one per score)
-- This only affects bulk-imported data, not app-logged sessions

-- Step 1: Create a temporary table to identify sessions that need consolidation
CREATE TEMP TABLE sessions_to_consolidate AS
SELECT 
  game_id,
  date,
  COALESCE(location, '') as location,
  COALESCE(duration_minutes, 0) as duration_minutes,
  array_agg(id ORDER BY created_at) as session_ids,
  string_agg(DISTINCT highlights, ' | ' ORDER BY highlights) as consolidated_highlights,
  count(*) as session_count
FROM sessions 
WHERE game_id IS NOT NULL
GROUP BY game_id, date, COALESCE(location, ''), COALESCE(duration_minutes, 0)
HAVING count(*) > 1;

-- Step 2: For each group of over-split sessions, keep the first one and consolidate
DO $$
DECLARE
  rec RECORD;
  keep_session_id uuid;
  delete_session_ids uuid[];
BEGIN
  FOR rec IN SELECT * FROM sessions_to_consolidate LOOP
    -- Keep the first session (oldest by creation time)
    keep_session_id := rec.session_ids[1];
    delete_session_ids := rec.session_ids[2:];
    
    -- Update the kept session with consolidated highlights
    UPDATE sessions 
    SET highlights = rec.consolidated_highlights
    WHERE id = keep_session_id;
    
    -- Move all scores from duplicate sessions to the kept session
    UPDATE scores 
    SET session_id = keep_session_id
    WHERE session_id = ANY(delete_session_ids);
    
    -- Delete the duplicate sessions
    DELETE FROM sessions 
    WHERE id = ANY(delete_session_ids);
    
    RAISE NOTICE 'Consolidated % sessions for game % on % into session %', 
      rec.session_count, rec.game_id, rec.date, keep_session_id;
  END LOOP;
END $$;