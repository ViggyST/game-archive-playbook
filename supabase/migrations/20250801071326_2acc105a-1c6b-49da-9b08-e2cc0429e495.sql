
-- Add tag_type column to the tags table
ALTER TABLE tags ADD COLUMN IF NOT EXISTS tag_type TEXT DEFAULT 'Other';

-- Update some sample tags to have proper types (optional - for demonstration)
UPDATE tags SET tag_type = 'mechanic' WHERE name IN ('strategy', 'cooperative', 'deck-building', 'worker-placement', 'area-control');
UPDATE tags SET tag_type = 'theme' WHERE name IN ('fantasy', 'sci-fi', 'historical', 'modern', 'abstract');
UPDATE tags SET tag_type = 'player-count' WHERE name IN ('solo', '2-player', 'party', 'family');
