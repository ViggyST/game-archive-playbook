-- Fix syntax error and properly split all problematic sessions
-- This migration systematically handles all the game session splits

-- Step 1: Create additional sessions for Game 2 and Game 3 where needed
WITH problem_sessions AS (
    SELECT s.id as session_id, s.date, s.game_id, s.location, s.duration_minutes, s.highlights, g.name as game_name
    FROM sessions s
    JOIN games g ON s.game_id = g.id
    WHERE (s.date = '2025-04-22' AND g.name = 'Dominion')
       OR (s.date = '2025-04-15' AND g.name = 'Marvel Remix')
       OR (s.date = '2025-03-27' AND g.name = 'Marvel Remix')
       OR (s.date = '2025-03-16' AND g.name = 'Marvel Remix')
       OR (s.date = '2025-03-16' AND g.name = 'Let''s Make a Bus Route')
       OR (s.date = '2025-03-14' AND g.name = 'Circle the Wagon')
       OR (s.date = '2025-02-25' AND g.name = 'Gizmos')
       OR (s.date = '2025-02-05' AND g.name = 'Marvel Remix')
       OR (s.date = '2025-02-02' AND g.name = 'Marvel Remix')
       OR (s.date = '2025-01-30' AND g.name = 'Pax Pamir')
       OR (s.date = '2025-01-16' AND g.name = 'Let''s Make a Bus Route')
       OR (s.date = '2025-01-01' AND g.name = 'Clank!')
)
-- Create new sessions for all Game 2s
INSERT INTO sessions (id, game_id, date, location, duration_minutes, highlights)
SELECT 
    gen_random_uuid() as id,
    ps.game_id,
    ps.date,
    ps.location,
    ps.duration_minutes,
    ps.highlights
FROM problem_sessions ps;

-- Step 2: Create additional sessions for Game 3s (only 2025-03-16 Marvel Remix and 2025-02-05 Marvel Remix)
WITH problem_sessions AS (
    SELECT s.id as session_id, s.date, s.game_id, s.location, s.duration_minutes, s.highlights, g.name as game_name
    FROM sessions s
    JOIN games g ON s.game_id = g.id
    WHERE (s.date = '2025-03-16' AND g.name = 'Marvel Remix')
       OR (s.date = '2025-02-05' AND g.name = 'Marvel Remix')
)
INSERT INTO sessions (id, game_id, date, location, duration_minutes, highlights)
SELECT 
    gen_random_uuid() as id,
    ps.game_id,
    ps.date,
    ps.location,
    ps.duration_minutes,
    ps.highlights
FROM problem_sessions ps;

-- Step 3: Clear all existing scores for these problematic sessions
DELETE FROM scores 
WHERE session_id IN (
    SELECT s.id 
    FROM sessions s
    JOIN games g ON s.game_id = g.id
    WHERE (s.date = '2025-04-22' AND g.name = 'Dominion')
       OR (s.date = '2025-04-15' AND g.name = 'Marvel Remix')
       OR (s.date = '2025-03-27' AND g.name = 'Marvel Remix')
       OR (s.date = '2025-03-16' AND g.name = 'Marvel Remix')
       OR (s.date = '2025-03-16' AND g.name = 'Let''s Make a Bus Route')
       OR (s.date = '2025-03-14' AND g.name = 'Circle the Wagon')
       OR (s.date = '2025-02-25' AND g.name = 'Gizmos')
       OR (s.date = '2025-02-05' AND g.name = 'Marvel Remix')
       OR (s.date = '2025-02-02' AND g.name = 'Marvel Remix')
       OR (s.date = '2025-01-30' AND g.name = 'Pax Pamir')
       OR (s.date = '2025-01-16' AND g.name = 'Let''s Make a Bus Route')
       OR (s.date = '2025-01-01' AND g.name = 'Clank!')
);