-- Insert all correct scores for the split sessions
-- This will systematically add all the game scores you provided

WITH session_data AS (
    SELECT s.id as session_id, s.date, g.name as game_name,
           ROW_NUMBER() OVER (PARTITION BY s.date, g.name ORDER BY s.created_at) as game_num
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
),
player_ids AS (
    SELECT name, id FROM players
)
INSERT INTO scores (session_id, player_id, score, is_winner)
-- 2025-04-22 Dominion Game 1: Winner Bogi
SELECT sd.session_id, p.id, 36, true FROM session_data sd, player_ids p WHERE sd.date = '2025-04-22' AND sd.game_name = 'Dominion' AND sd.game_num = 1 AND p.name = 'Bogi'
UNION ALL SELECT sd.session_id, p.id, 26, false FROM session_data sd, player_ids p WHERE sd.date = '2025-04-22' AND sd.game_name = 'Dominion' AND sd.game_num = 1 AND p.name = 'Kirito'
UNION ALL SELECT sd.session_id, p.id, 11, false FROM session_data sd, player_ids p WHERE sd.date = '2025-04-22' AND sd.game_name = 'Dominion' AND sd.game_num = 1 AND p.name = 'Saravanan'
UNION ALL SELECT sd.session_id, p.id, 15, false FROM session_data sd, player_ids p WHERE sd.date = '2025-04-22' AND sd.game_name = 'Dominion' AND sd.game_num = 1 AND p.name = 'Mandy'

-- 2025-04-22 Dominion Game 2: Winner Kirito
UNION ALL SELECT sd.session_id, p.id, 26, false FROM session_data sd, player_ids p WHERE sd.date = '2025-04-22' AND sd.game_name = 'Dominion' AND sd.game_num = 2 AND p.name = 'Bogi'
UNION ALL SELECT sd.session_id, p.id, 33, true FROM session_data sd, player_ids p WHERE sd.date = '2025-04-22' AND sd.game_name = 'Dominion' AND sd.game_num = 2 AND p.name = 'Kirito'
UNION ALL SELECT sd.session_id, p.id, 15, false FROM session_data sd, player_ids p WHERE sd.date = '2025-04-22' AND sd.game_name = 'Dominion' AND sd.game_num = 2 AND p.name = 'Saravanan'
UNION ALL SELECT sd.session_id, p.id, 21, false FROM session_data sd, player_ids p WHERE sd.date = '2025-04-22' AND sd.game_name = 'Dominion' AND sd.game_num = 2 AND p.name = 'Mandy'

-- 2025-04-15 Marvel Remix Game 1: Winner Bogi
UNION ALL SELECT sd.session_id, p.id, 82, true FROM session_data sd, player_ids p WHERE sd.date = '2025-04-15' AND sd.game_name = 'Marvel Remix' AND sd.game_num = 1 AND p.name = 'Bogi'
UNION ALL SELECT sd.session_id, p.id, 71, false FROM session_data sd, player_ids p WHERE sd.date = '2025-04-15' AND sd.game_name = 'Marvel Remix' AND sd.game_num = 1 AND p.name = 'Kirito'
UNION ALL SELECT sd.session_id, p.id, 58, false FROM session_data sd, player_ids p WHERE sd.date = '2025-04-15' AND sd.game_name = 'Marvel Remix' AND sd.game_num = 1 AND p.name = 'Saravanan'

-- 2025-04-15 Marvel Remix Game 2: Winner Bogi
UNION ALL SELECT sd.session_id, p.id, 86, true FROM session_data sd, player_ids p WHERE sd.date = '2025-04-15' AND sd.game_name = 'Marvel Remix' AND sd.game_num = 2 AND p.name = 'Bogi'
UNION ALL SELECT sd.session_id, p.id, 75, false FROM session_data sd, player_ids p WHERE sd.date = '2025-04-15' AND sd.game_name = 'Marvel Remix' AND sd.game_num = 2 AND p.name = 'Kirito'
UNION ALL SELECT sd.session_id, p.id, 64, false FROM session_data sd, player_ids p WHERE sd.date = '2025-04-15' AND sd.game_name = 'Marvel Remix' AND sd.game_num = 2 AND p.name = 'Saravanan'

-- 2025-03-27 Marvel Remix Game 1: Winner Bogi
UNION ALL SELECT sd.session_id, p.id, 109, true FROM session_data sd, player_ids p WHERE sd.date = '2025-03-27' AND sd.game_name = 'Marvel Remix' AND sd.game_num = 1 AND p.name = 'Bogi'
UNION ALL SELECT sd.session_id, p.id, 85, false FROM session_data sd, player_ids p WHERE sd.date = '2025-03-27' AND sd.game_name = 'Marvel Remix' AND sd.game_num = 1 AND p.name = 'Meepledeen'

-- 2025-03-27 Marvel Remix Game 2: Winner Bogi
UNION ALL SELECT sd.session_id, p.id, 83, true FROM session_data sd, player_ids p WHERE sd.date = '2025-03-27' AND sd.game_name = 'Marvel Remix' AND sd.game_num = 2 AND p.name = 'Bogi'
UNION ALL SELECT sd.session_id, p.id, 67, false FROM session_data sd, player_ids p WHERE sd.date = '2025-03-27' AND sd.game_name = 'Marvel Remix' AND sd.game_num = 2 AND p.name = 'Meepledeen'

-- 2025-03-16 Marvel Remix Game 1: Winner Kirito
UNION ALL SELECT sd.session_id, p.id, 67, false FROM session_data sd, player_ids p WHERE sd.date = '2025-03-16' AND sd.game_name = 'Marvel Remix' AND sd.game_num = 1 AND p.name = 'Bogi'
UNION ALL SELECT sd.session_id, p.id, 77, false FROM session_data sd, player_ids p WHERE sd.date = '2025-03-16' AND sd.game_name = 'Marvel Remix' AND sd.game_num = 1 AND p.name = 'Meepledeen'
UNION ALL SELECT sd.session_id, p.id, 81, true FROM session_data sd, player_ids p WHERE sd.date = '2025-03-16' AND sd.game_name = 'Marvel Remix' AND sd.game_num = 1 AND p.name = 'Kirito'

-- 2025-03-16 Marvel Remix Game 2: Winner Kirito
UNION ALL SELECT sd.session_id, p.id, 68, false FROM session_data sd, player_ids p WHERE sd.date = '2025-03-16' AND sd.game_name = 'Marvel Remix' AND sd.game_num = 2 AND p.name = 'Bogi'
UNION ALL SELECT sd.session_id, p.id, 78, true FROM session_data sd, player_ids p WHERE sd.date = '2025-03-16' AND sd.game_name = 'Marvel Remix' AND sd.game_num = 2 AND p.name = 'Kirito'

-- 2025-03-16 Marvel Remix Game 3: Winner Bogi
UNION ALL SELECT sd.session_id, p.id, 106, true FROM session_data sd, player_ids p WHERE sd.date = '2025-03-16' AND sd.game_name = 'Marvel Remix' AND sd.game_num = 3 AND p.name = 'Bogi'
UNION ALL SELECT sd.session_id, p.id, 92, false FROM session_data sd, player_ids p WHERE sd.date = '2025-03-16' AND sd.game_name = 'Marvel Remix' AND sd.game_num = 3 AND p.name = 'Kirito'

-- 2025-03-16 Let's Make a Bus Route Game 1: Winner Bogi
UNION ALL SELECT sd.session_id, p.id, 68, true FROM session_data sd, player_ids p WHERE sd.date = '2025-03-16' AND sd.game_name = 'Let''s Make a Bus Route' AND sd.game_num = 1 AND p.name = 'Bogi'
UNION ALL SELECT sd.session_id, p.id, 42, false FROM session_data sd, player_ids p WHERE sd.date = '2025-03-16' AND sd.game_name = 'Let''s Make a Bus Route' AND sd.game_num = 1 AND p.name = 'Meepledeen'
UNION ALL SELECT sd.session_id, p.id, 28, false FROM session_data sd, player_ids p WHERE sd.date = '2025-03-16' AND sd.game_name = 'Let''s Make a Bus Route' AND sd.game_num = 1 AND p.name = 'Mandy'
UNION ALL SELECT sd.session_id, p.id, 36, false FROM session_data sd, player_ids p WHERE sd.date = '2025-03-16' AND sd.game_name = 'Let''s Make a Bus Route' AND sd.game_num = 1 AND p.name = 'Aaku'

-- 2025-03-16 Let's Make a Bus Route Game 2: Winner Bogi
UNION ALL SELECT sd.session_id, p.id, 67, true FROM session_data sd, player_ids p WHERE sd.date = '2025-03-16' AND sd.game_name = 'Let''s Make a Bus Route' AND sd.game_num = 2 AND p.name = 'Bogi'
UNION ALL SELECT sd.session_id, p.id, 42, false FROM session_data sd, player_ids p WHERE sd.date = '2025-03-16' AND sd.game_name = 'Let''s Make a Bus Route' AND sd.game_num = 2 AND p.name = 'Meepledeen'
UNION ALL SELECT sd.session_id, p.id, 28, false FROM session_data sd, player_ids p WHERE sd.date = '2025-03-16' AND sd.game_name = 'Let''s Make a Bus Route' AND sd.game_num = 2 AND p.name = 'Mandy'
UNION ALL SELECT sd.session_id, p.id, 36, false FROM session_data sd, player_ids p WHERE sd.date = '2025-03-16' AND sd.game_name = 'Let''s Make a Bus Route' AND sd.game_num = 2 AND p.name = 'Aaku'
UNION ALL SELECT sd.session_id, p.id, 64, false FROM session_data sd, player_ids p WHERE sd.date = '2025-03-16' AND sd.game_name = 'Let''s Make a Bus Route' AND sd.game_num = 2 AND p.name = 'Kirito'

-- 2025-03-14 Circle the Wagon Game 1: Winner Kirito
UNION ALL SELECT sd.session_id, p.id, 31, false FROM session_data sd, player_ids p WHERE sd.date = '2025-03-14' AND sd.game_name = 'Circle the Wagon' AND sd.game_num = 1 AND p.name = 'Bogi'
UNION ALL SELECT sd.session_id, p.id, 29, true FROM session_data sd, player_ids p WHERE sd.date = '2025-03-14' AND sd.game_name = 'Circle the Wagon' AND sd.game_num = 1 AND p.name = 'Kirito'

-- 2025-03-14 Circle the Wagon Game 2: Winner Kirito  
UNION ALL SELECT sd.session_id, p.id, 48, false FROM session_data sd, player_ids p WHERE sd.date = '2025-03-14' AND sd.game_name = 'Circle the Wagon' AND sd.game_num = 2 AND p.name = 'Bogi'
UNION ALL SELECT sd.session_id, p.id, 45, true FROM session_data sd, player_ids p WHERE sd.date = '2025-03-14' AND sd.game_name = 'Circle the Wagon' AND sd.game_num = 2 AND p.name = 'Kirito'

-- 2025-02-25 Gizmos Game 1: Winner Bogi
UNION ALL SELECT sd.session_id, p.id, 64, true FROM session_data sd, player_ids p WHERE sd.date = '2025-02-25' AND sd.game_name = 'Gizmos' AND sd.game_num = 1 AND p.name = 'Bogi'
UNION ALL SELECT sd.session_id, p.id, 40, false FROM session_data sd, player_ids p WHERE sd.date = '2025-02-25' AND sd.game_name = 'Gizmos' AND sd.game_num = 1 AND p.name = 'Kirito'

-- 2025-02-25 Gizmos Game 2: Winner Bogi
UNION ALL SELECT sd.session_id, p.id, 37, true FROM session_data sd, player_ids p WHERE sd.date = '2025-02-25' AND sd.game_name = 'Gizmos' AND sd.game_num = 2 AND p.name = 'Bogi'
UNION ALL SELECT sd.session_id, p.id, 34, false FROM session_data sd, player_ids p WHERE sd.date = '2025-02-25' AND sd.game_name = 'Gizmos' AND sd.game_num = 2 AND p.name = 'Kirito'

-- 2025-02-05 Marvel Remix Game 1: Winner Meepledeen (note: Bogi 94, Meepledeen 95 - Meepledeen wins)
UNION ALL SELECT sd.session_id, p.id, 94, false FROM session_data sd, player_ids p WHERE sd.date = '2025-02-05' AND sd.game_name = 'Marvel Remix' AND sd.game_num = 1 AND p.name = 'Bogi'
UNION ALL SELECT sd.session_id, p.id, 95, true FROM session_data sd, player_ids p WHERE sd.date = '2025-02-05' AND sd.game_name = 'Marvel Remix' AND sd.game_num = 1 AND p.name = 'Meepledeen'

-- 2025-02-05 Marvel Remix Game 2: Winner Meepledeen
UNION ALL SELECT sd.session_id, p.id, 74, false FROM session_data sd, player_ids p WHERE sd.date = '2025-02-05' AND sd.game_name = 'Marvel Remix' AND sd.game_num = 2 AND p.name = 'Bogi'
UNION ALL SELECT sd.session_id, p.id, 114, true FROM session_data sd, player_ids p WHERE sd.date = '2025-02-05' AND sd.game_name = 'Marvel Remix' AND sd.game_num = 2 AND p.name = 'Meepledeen'

-- 2025-02-05 Marvel Remix Game 3: Winner Meepledeen (null scores - skip)
-- Note: You mentioned null scores for Game 3, so we won't insert those

-- 2025-02-02 Marvel Remix Game 1: Winner Mandy
UNION ALL SELECT sd.session_id, p.id, 97, false FROM session_data sd, player_ids p WHERE sd.date = '2025-02-02' AND sd.game_name = 'Marvel Remix' AND sd.game_num = 1 AND p.name = 'Bogi'
UNION ALL SELECT sd.session_id, p.id, 90, false FROM session_data sd, player_ids p WHERE sd.date = '2025-02-02' AND sd.game_name = 'Marvel Remix' AND sd.game_num = 1 AND p.name = 'Kirito'
UNION ALL SELECT sd.session_id, p.id, 112, true FROM session_data sd, player_ids p WHERE sd.date = '2025-02-02' AND sd.game_name = 'Marvel Remix' AND sd.game_num = 1 AND p.name = 'Mandy'

-- 2025-02-02 Marvel Remix Game 2: Winner Bogi
UNION ALL SELECT sd.session_id, p.id, 94, true FROM session_data sd, player_ids p WHERE sd.date = '2025-02-02' AND sd.game_name = 'Marvel Remix' AND sd.game_num = 2 AND p.name = 'Bogi'
UNION ALL SELECT sd.session_id, p.id, 84, false FROM session_data sd, player_ids p WHERE sd.date = '2025-02-02' AND sd.game_name = 'Marvel Remix' AND sd.game_num = 2 AND p.name = 'Kirito'
UNION ALL SELECT sd.session_id, p.id, 65, false FROM session_data sd, player_ids p WHERE sd.date = '2025-02-02' AND sd.game_name = 'Marvel Remix' AND sd.game_num = 2 AND p.name = 'Mandy'

-- 2025-01-30 Pax Pamir Game 1: Winner Bogi
UNION ALL SELECT sd.session_id, p.id, 4, true FROM session_data sd, player_ids p WHERE sd.date = '2025-01-30' AND sd.game_name = 'Pax Pamir' AND sd.game_num = 1 AND p.name = 'Bogi'
UNION ALL SELECT sd.session_id, p.id, 0, false FROM session_data sd, player_ids p WHERE sd.date = '2025-01-30' AND sd.game_name = 'Pax Pamir' AND sd.game_num = 1 AND p.name = 'Kirito'

-- 2025-01-30 Pax Pamir Game 2: Winner Kirito
UNION ALL SELECT sd.session_id, p.id, 4, false FROM session_data sd, player_ids p WHERE sd.date = '2025-01-30' AND sd.game_name = 'Pax Pamir' AND sd.game_num = 2 AND p.name = 'Bogi'
UNION ALL SELECT sd.session_id, p.id, 8, true FROM session_data sd, player_ids p WHERE sd.date = '2025-01-30' AND sd.game_name = 'Pax Pamir' AND sd.game_num = 2 AND p.name = 'Kirito'

-- 2025-01-16 Let's Make a Bus Route Game 1: Winner Bogi (1-0)
UNION ALL SELECT sd.session_id, p.id, 1, true FROM session_data sd, player_ids p WHERE sd.date = '2025-01-16' AND sd.game_name = 'Let''s Make a Bus Route' AND sd.game_num = 1 AND p.name = 'Bogi'
-- Note: You mentioned "Others 0" - need player names for complete data

-- 2025-01-16 Let's Make a Bus Route Game 2: Winner Bogi, Kirito 0
UNION ALL SELECT sd.session_id, p.id, 1, true FROM session_data sd, player_ids p WHERE sd.date = '2025-01-16' AND sd.game_name = 'Let''s Make a Bus Route' AND sd.game_num = 2 AND p.name = 'Bogi'
UNION ALL SELECT sd.session_id, p.id, 0, false FROM session_data sd, player_ids p WHERE sd.date = '2025-01-16' AND sd.game_name = 'Let''s Make a Bus Route' AND sd.game_num = 2 AND p.name = 'Kirito'

-- 2025-01-01 Clank! Game 1: Winner Bogi
UNION ALL SELECT sd.session_id, p.id, 1, true FROM session_data sd, player_ids p WHERE sd.date = '2025-01-01' AND sd.game_name = 'Clank!' AND sd.game_num = 1 AND p.name = 'Bogi'
UNION ALL SELECT sd.session_id, p.id, 0, false FROM session_data sd, player_ids p WHERE sd.date = '2025-01-01' AND sd.game_name = 'Clank!' AND sd.game_num = 1 AND p.name = 'Kirito'

-- 2025-01-01 Clank! Game 2: Winner Kirito
UNION ALL SELECT sd.session_id, p.id, 0, false FROM session_data sd, player_ids p WHERE sd.date = '2025-01-01' AND sd.game_name = 'Clank!' AND sd.game_num = 2 AND p.name = 'Bogi'
UNION ALL SELECT sd.session_id, p.id, 1, true FROM session_data sd, player_ids p WHERE sd.date = '2025-01-01' AND sd.game_name = 'Clank!' AND sd.game_num = 2 AND p.name = 'Kirito';