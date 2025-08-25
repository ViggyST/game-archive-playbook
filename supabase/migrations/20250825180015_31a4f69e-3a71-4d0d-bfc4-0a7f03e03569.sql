-- Fix Aug 5th Onitama games - create separate sessions for each game

-- Get the current session and game IDs
DO $$
DECLARE
    original_session_id uuid := '53b31ac9-f9e4-45fa-9170-8f70b3c445b5';
    new_session_id uuid := gen_random_uuid();
    onitama_game_id uuid;
    kirito_id uuid;
    bogi_id uuid;
BEGIN
    -- Get game ID for Onitama
    SELECT id INTO onitama_game_id FROM games WHERE name = 'Onitama';
    
    -- Get player IDs
    SELECT id INTO kirito_id FROM players WHERE name = 'Kirito';
    SELECT id INTO bogi_id FROM players WHERE name = 'Bogi';
    
    -- Create new session for the second game (Bogi vs Kirito)
    INSERT INTO sessions (id, date, game_id, location, duration_minutes, created_at)
    VALUES (new_session_id, '2025-08-05', onitama_game_id, 'Mandar''s Place', 30, now());
    
    -- Update Bogi's score to point to the new session
    UPDATE scores 
    SET session_id = new_session_id
    WHERE session_id = original_session_id 
    AND player_id = bogi_id;
    
    -- Update one of Kirito's losing scores to point to the new session 
    -- (this represents Kirito losing to Bogi in game 2)
    UPDATE scores 
    SET session_id = new_session_id
    WHERE session_id = original_session_id 
    AND player_id = kirito_id 
    AND is_winner = false
    AND score = 0;
    
END $$;