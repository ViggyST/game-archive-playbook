-- Clean up data integrity issues for specific dates and insert correct session data

-- Delete existing sessions for these dates to avoid duplicates
DELETE FROM scores WHERE session_id IN (
  SELECT id FROM sessions WHERE date IN (
    '2025-01-01', '2025-01-16', '2025-02-02', '2025-02-05', 
    '2025-03-14', '2025-03-16', '2025-03-27', '2025-04-15'
  )
);

DELETE FROM sessions WHERE date IN (
  '2025-01-01', '2025-01-16', '2025-02-02', '2025-02-05', 
  '2025-03-14', '2025-03-16', '2025-03-27', '2025-04-15'
);

-- Insert or get player IDs (in case some don't exist)
INSERT INTO players (name) VALUES 
  ('Bogi'), ('Kirito'), ('Meepledeen'), ('Mandy'), ('Saravanan'), ('Aaku')
ON CONFLICT (name) DO NOTHING;

-- Insert or get game IDs (in case some don't exist)
INSERT INTO games (name, weight) VALUES 
  ('Clank!', 'medium'),
  ('Everdell', 'medium'),
  ('Let''s make a bus route', 'light'),
  ('Marvel Remix', 'medium'),
  ('Castles of Burgundy', 'medium'),
  ('Circle the wagon', 'light'),
  ('Final Girl', 'medium')
ON CONFLICT (name) DO NOTHING;

-- Jan 1, 2025 - 2 Clank sessions
INSERT INTO sessions (id, date, game_id, duration_minutes, location) VALUES
  (gen_random_uuid(), '2025-01-01', (SELECT id FROM games WHERE name = 'Clank!'), 90, 'Home'),
  (gen_random_uuid(), '2025-01-01', (SELECT id FROM games WHERE name = 'Clank!'), 90, 'Home');

WITH jan1_sessions AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn 
  FROM sessions WHERE date = '2025-01-01'
)
INSERT INTO scores (session_id, player_id, score, is_winner) VALUES
  -- Session 1: Bogi wins
  ((SELECT id FROM jan1_sessions WHERE rn = 1), (SELECT id FROM players WHERE name = 'Bogi'), null, true),
  ((SELECT id FROM jan1_sessions WHERE rn = 1), (SELECT id FROM players WHERE name = 'Kirito'), null, false),
  -- Session 2: Kirito wins  
  ((SELECT id FROM jan1_sessions WHERE rn = 2), (SELECT id FROM players WHERE name = 'Bogi'), null, false),
  ((SELECT id FROM jan1_sessions WHERE rn = 2), (SELECT id FROM players WHERE name = 'Kirito'), null, true);

-- Update session 2 with notes
UPDATE sessions SET highlights = 'Bogi got eaten by monster in the underworld' 
WHERE date = '2025-01-01' AND id = (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn 
    FROM sessions WHERE date = '2025-01-01'
  ) sub WHERE rn = 2
);

-- Jan 16, 2025 - 3 sessions
INSERT INTO sessions (id, date, game_id, duration_minutes, location) VALUES
  (gen_random_uuid(), '2025-01-16', (SELECT id FROM games WHERE name = 'Everdell'), 150, 'Home'),
  (gen_random_uuid(), '2025-01-16', (SELECT id FROM games WHERE name = 'Let''s make a bus route'), 120, 'Home'),
  (gen_random_uuid(), '2025-01-16', (SELECT id FROM games WHERE name = 'Let''s make a bus route'), 30, 'Home');

WITH jan16_sessions AS (
  SELECT id, game_id, ROW_NUMBER() OVER (ORDER BY id) as rn 
  FROM sessions WHERE date = '2025-01-16'
)
INSERT INTO scores (session_id, player_id, score, is_winner) VALUES
  -- Session 1: Everdell - Bogi wins
  ((SELECT id FROM jan16_sessions WHERE rn = 1), (SELECT id FROM players WHERE name = 'Bogi'), null, true),
  ((SELECT id FROM jan16_sessions WHERE rn = 1), (SELECT id FROM players WHERE name = 'Kirito'), null, false),
  -- Session 2: Bus Route - Bogi wins
  ((SELECT id FROM jan16_sessions WHERE rn = 2), (SELECT id FROM players WHERE name = 'Bogi'), null, true),
  ((SELECT id FROM jan16_sessions WHERE rn = 2), (SELECT id FROM players WHERE name = 'Kirito'), null, false),
  -- Session 3: Bus Route - Bogi wins (3 players)
  ((SELECT id FROM jan16_sessions WHERE rn = 3), (SELECT id FROM players WHERE name = 'Meepledeen'), null, false),
  ((SELECT id FROM jan16_sessions WHERE rn = 3), (SELECT id FROM players WHERE name = 'Bogi'), null, true),
  ((SELECT id FROM jan16_sessions WHERE rn = 3), (SELECT id FROM players WHERE name = 'Kirito'), null, false);

-- Feb 2, 2025 - 2 Marvel Remix sessions
INSERT INTO sessions (id, date, game_id, duration_minutes, location) VALUES
  (gen_random_uuid(), '2025-02-02', (SELECT id FROM games WHERE name = 'Marvel Remix'), 30, 'Home'),
  (gen_random_uuid(), '2025-02-02', (SELECT id FROM games WHERE name = 'Marvel Remix'), 30, 'Home');

WITH feb2_sessions AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn 
  FROM sessions WHERE date = '2025-02-02'
)
INSERT INTO scores (session_id, player_id, score, is_winner) VALUES
  -- Session 1: Mandy wins
  ((SELECT id FROM feb2_sessions WHERE rn = 1), (SELECT id FROM players WHERE name = 'Bogi'), 97, false),
  ((SELECT id FROM feb2_sessions WHERE rn = 1), (SELECT id FROM players WHERE name = 'Kirito'), 90, false),
  ((SELECT id FROM feb2_sessions WHERE rn = 1), (SELECT id FROM players WHERE name = 'Mandy'), 112, true),
  -- Session 2: Bogi wins
  ((SELECT id FROM feb2_sessions WHERE rn = 2), (SELECT id FROM players WHERE name = 'Bogi'), 94, true),
  ((SELECT id FROM feb2_sessions WHERE rn = 2), (SELECT id FROM players WHERE name = 'Kirito'), 84, false),
  ((SELECT id FROM feb2_sessions WHERE rn = 2), (SELECT id FROM players WHERE name = 'Mandy'), 65, false);

-- Feb 5, 2025 - 3 Marvel Remix sessions
INSERT INTO sessions (id, date, game_id, duration_minutes, location) VALUES
  (gen_random_uuid(), '2025-02-05', (SELECT id FROM games WHERE name = 'Marvel Remix'), 30, 'Home'),
  (gen_random_uuid(), '2025-02-05', (SELECT id FROM games WHERE name = 'Marvel Remix'), 30, 'Home'),
  (gen_random_uuid(), '2025-02-05', (SELECT id FROM games WHERE name = 'Marvel Remix'), 30, 'Home');

WITH feb5_sessions AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn 
  FROM sessions WHERE date = '2025-02-05'
)
INSERT INTO scores (session_id, player_id, score, is_winner) VALUES
  -- Session 1: Bogi wins (close game)
  ((SELECT id FROM feb5_sessions WHERE rn = 1), (SELECT id FROM players WHERE name = 'Meepledeen'), 95, false),
  ((SELECT id FROM feb5_sessions WHERE rn = 1), (SELECT id FROM players WHERE name = 'Bogi'), 94, true),
  -- Session 2: Meepledeen wins
  ((SELECT id FROM feb5_sessions WHERE rn = 2), (SELECT id FROM players WHERE name = 'Meepledeen'), 114, true),
  ((SELECT id FROM feb5_sessions WHERE rn = 2), (SELECT id FROM players WHERE name = 'Bogi'), 74, false),
  -- Session 3: Meepledeen wins (Bogi resigned)
  ((SELECT id FROM feb5_sessions WHERE rn = 3), (SELECT id FROM players WHERE name = 'Meepledeen'), 1, true),
  ((SELECT id FROM feb5_sessions WHERE rn = 3), (SELECT id FROM players WHERE name = 'Bogi'), 0, false);

-- Update session 3 with resignation note
UPDATE sessions SET highlights = 'Bogi resigned' 
WHERE date = '2025-02-05' AND id = (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn 
    FROM sessions WHERE date = '2025-02-05'
  ) sub WHERE rn = 3
);

-- Mar 14, 2025 - 3 sessions
INSERT INTO sessions (id, date, game_id, duration_minutes, location) VALUES
  (gen_random_uuid(), '2025-03-14', (SELECT id FROM games WHERE name = 'Castles of Burgundy'), 105, 'Home'),
  (gen_random_uuid(), '2025-03-14', (SELECT id FROM games WHERE name = 'Circle the wagon'), 15, 'Home'),
  (gen_random_uuid(), '2025-03-14', (SELECT id FROM games WHERE name = 'Circle the wagon'), 15, 'Home');

WITH mar14_sessions AS (
  SELECT id, game_id, ROW_NUMBER() OVER (ORDER BY id) as rn 
  FROM sessions WHERE date = '2025-03-14'
)
INSERT INTO scores (session_id, player_id, score, is_winner) VALUES
  -- Session 1: Castles of Burgundy - Bogi wins
  ((SELECT id FROM mar14_sessions WHERE rn = 1), (SELECT id FROM players WHERE name = 'Bogi'), 215, true),
  ((SELECT id FROM mar14_sessions WHERE rn = 1), (SELECT id FROM players WHERE name = 'Meepledeen'), 180, false),
  ((SELECT id FROM mar14_sessions WHERE rn = 1), (SELECT id FROM players WHERE name = 'Kirito'), 190, false),
  -- Session 2: Circle the wagon - Kirito wins (lower score wins)
  ((SELECT id FROM mar14_sessions WHERE rn = 2), (SELECT id FROM players WHERE name = 'Bogi'), 31, false),
  ((SELECT id FROM mar14_sessions WHERE rn = 2), (SELECT id FROM players WHERE name = 'Kirito'), 29, true),
  -- Session 3: Circle the wagon - Kirito wins (lower score wins)
  ((SELECT id FROM mar14_sessions WHERE rn = 3), (SELECT id FROM players WHERE name = 'Bogi'), 48, false),
  ((SELECT id FROM mar14_sessions WHERE rn = 3), (SELECT id FROM players WHERE name = 'Kirito'), 45, true);

-- Mar 16, 2025 - 6 sessions
INSERT INTO sessions (id, date, game_id, duration_minutes, location) VALUES
  (gen_random_uuid(), '2025-03-16', (SELECT id FROM games WHERE name = 'Final Girl'), 30, 'Home'),
  (gen_random_uuid(), '2025-03-16', (SELECT id FROM games WHERE name = 'Let''s make a bus route'), 105, 'Home'),
  (gen_random_uuid(), '2025-03-16', (SELECT id FROM games WHERE name = 'Let''s make a bus route'), 30, 'Home'),
  (gen_random_uuid(), '2025-03-16', (SELECT id FROM games WHERE name = 'Marvel Remix'), 30, 'Home'),
  (gen_random_uuid(), '2025-03-16', (SELECT id FROM games WHERE name = 'Marvel Remix'), 30, 'Home'),
  (gen_random_uuid(), '2025-03-16', (SELECT id FROM games WHERE name = 'Marvel Remix'), 30, 'Home');

WITH mar16_sessions AS (
  SELECT id, game_id, ROW_NUMBER() OVER (ORDER BY id) as rn 
  FROM sessions WHERE date = '2025-03-16'
)
INSERT INTO scores (session_id, player_id, score, is_winner) VALUES
  -- Session 1: Final Girl - Killer wins (solo game)
  ((SELECT id FROM mar16_sessions WHERE rn = 1), (SELECT id FROM players WHERE name = 'Bogi'), null, false),
  -- Session 2: Bus Route - Bogi wins
  ((SELECT id FROM mar16_sessions WHERE rn = 2), (SELECT id FROM players WHERE name = 'Bogi'), 68, true),
  ((SELECT id FROM mar16_sessions WHERE rn = 2), (SELECT id FROM players WHERE name = 'Meepledeen'), 42, false),
  ((SELECT id FROM mar16_sessions WHERE rn = 2), (SELECT id FROM players WHERE name = 'Mandy'), 28, false),
  ((SELECT id FROM mar16_sessions WHERE rn = 2), (SELECT id FROM players WHERE name = 'Aaku'), 36, false),
  -- Session 3: Bus Route - Bogi wins
  ((SELECT id FROM mar16_sessions WHERE rn = 3), (SELECT id FROM players WHERE name = 'Bogi'), 67, true),
  ((SELECT id FROM mar16_sessions WHERE rn = 3), (SELECT id FROM players WHERE name = 'Meepledeen'), 42, false),
  ((SELECT id FROM mar16_sessions WHERE rn = 3), (SELECT id FROM players WHERE name = 'Mandy'), 28, false),
  ((SELECT id FROM mar16_sessions WHERE rn = 3), (SELECT id FROM players WHERE name = 'Aaku'), 36, false),
  ((SELECT id FROM mar16_sessions WHERE rn = 3), (SELECT id FROM players WHERE name = 'Kirito'), 64, false),
  -- Session 4: Marvel Remix - Kirito wins
  ((SELECT id FROM mar16_sessions WHERE rn = 4), (SELECT id FROM players WHERE name = 'Bogi'), 67, false),
  ((SELECT id FROM mar16_sessions WHERE rn = 4), (SELECT id FROM players WHERE name = 'Meepledeen'), 77, false),
  ((SELECT id FROM mar16_sessions WHERE rn = 4), (SELECT id FROM players WHERE name = 'Kirito'), 81, true),
  -- Session 5: Marvel Remix - Kirito wins
  ((SELECT id FROM mar16_sessions WHERE rn = 5), (SELECT id FROM players WHERE name = 'Bogi'), 68, false),
  ((SELECT id FROM mar16_sessions WHERE rn = 5), (SELECT id FROM players WHERE name = 'Kirito'), 78, true),
  -- Session 6: Marvel Remix - Bogi wins
  ((SELECT id FROM mar16_sessions WHERE rn = 6), (SELECT id FROM players WHERE name = 'Bogi'), 106, true),
  ((SELECT id FROM mar16_sessions WHERE rn = 6), (SELECT id FROM players WHERE name = 'Kirito'), 92, false);

-- Mar 27, 2025 - 2 Marvel Remix sessions
INSERT INTO sessions (id, date, game_id, duration_minutes, location) VALUES
  (gen_random_uuid(), '2025-03-27', (SELECT id FROM games WHERE name = 'Marvel Remix'), 30, 'Home'),
  (gen_random_uuid(), '2025-03-27', (SELECT id FROM games WHERE name = 'Marvel Remix'), 30, 'Home');

WITH mar27_sessions AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn 
  FROM sessions WHERE date = '2025-03-27'
)
INSERT INTO scores (session_id, player_id, score, is_winner) VALUES
  -- Session 1: Bogi wins
  ((SELECT id FROM mar27_sessions WHERE rn = 1), (SELECT id FROM players WHERE name = 'Bogi'), 109, true),
  ((SELECT id FROM mar27_sessions WHERE rn = 1), (SELECT id FROM players WHERE name = 'Meepledeen'), 85, false),
  -- Session 2: Bogi wins
  ((SELECT id FROM mar27_sessions WHERE rn = 2), (SELECT id FROM players WHERE name = 'Bogi'), 83, true),
  ((SELECT id FROM mar27_sessions WHERE rn = 2), (SELECT id FROM players WHERE name = 'Meepledeen'), 67, false);

-- Apr 15, 2025 - 3 sessions
INSERT INTO sessions (id, date, game_id, duration_minutes, location) VALUES
  (gen_random_uuid(), '2025-04-15', (SELECT id FROM games WHERE name = 'Clank!'), 180, 'Home'),
  (gen_random_uuid(), '2025-04-15', (SELECT id FROM games WHERE name = 'Marvel Remix'), 15, 'Home'),
  (gen_random_uuid(), '2025-04-15', (SELECT id FROM games WHERE name = 'Marvel Remix'), 15, 'Home');

WITH apr15_sessions AS (
  SELECT id, game_id, ROW_NUMBER() OVER (ORDER BY id) as rn 
  FROM sessions WHERE date = '2025-04-15'
)
INSERT INTO scores (session_id, player_id, score, is_winner) VALUES
  -- Session 1: Clank! - Kirito wins
  ((SELECT id FROM apr15_sessions WHERE rn = 1), (SELECT id FROM players WHERE name = 'Bogi'), 131, false),
  ((SELECT id FROM apr15_sessions WHERE rn = 1), (SELECT id FROM players WHERE name = 'Kirito'), 142, true),
  ((SELECT id FROM apr15_sessions WHERE rn = 1), (SELECT id FROM players WHERE name = 'Saravanan'), 54, false),
  -- Session 2: Marvel Remix - Bogi wins
  ((SELECT id FROM apr15_sessions WHERE rn = 2), (SELECT id FROM players WHERE name = 'Bogi'), 82, true),
  ((SELECT id FROM apr15_sessions WHERE rn = 2), (SELECT id FROM players WHERE name = 'Kirito'), 71, false),
  ((SELECT id FROM apr15_sessions WHERE rn = 2), (SELECT id FROM players WHERE name = 'Saravanan'), 58, false),
  -- Session 3: Marvel Remix - Bogi wins
  ((SELECT id FROM apr15_sessions WHERE rn = 3), (SELECT id FROM players WHERE name = 'Bogi'), 86, true),
  ((SELECT id FROM apr15_sessions WHERE rn = 3), (SELECT id FROM players WHERE name = 'Kirito'), 75, false),
  ((SELECT id FROM apr15_sessions WHERE rn = 3), (SELECT id FROM players WHERE name = 'Saravanan'), 64, false);