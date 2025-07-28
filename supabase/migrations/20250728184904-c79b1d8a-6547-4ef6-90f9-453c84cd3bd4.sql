
-- First, let's create the enum type for collection_type
CREATE TYPE collection_type_enum AS ENUM ('owned', 'wishlist');

-- Drop the existing collections table to start fresh with the optimized structure
DROP TABLE IF EXISTS public.collections CASCADE;

-- Create the optimized collections table
CREATE TABLE public.collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.players(id),
  game_id UUID NOT NULL REFERENCES public.games(id),
  collection_type collection_type_enum NOT NULL,
  rulebook_url TEXT,
  notes TEXT,
  is_manual BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(player_id, game_id, collection_type)
);

-- Create normalized tags table
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create join table for collection tags
CREATE TABLE public.collection_tags (
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (collection_id, tag_id)
);

-- Add Row Level Security
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_tags ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for now (since we're using player-based context)
CREATE POLICY "Allow all access to collections" 
  ON public.collections 
  FOR ALL 
  USING (true);

CREATE POLICY "Allow all access to tags" 
  ON public.tags 
  FOR ALL 
  USING (true);

CREATE POLICY "Allow all access to collection_tags" 
  ON public.collection_tags 
  FOR ALL 
  USING (true);

-- Insert common board game tags
INSERT INTO public.tags (name) VALUES
  ('engine-builder'),
  ('birds'),
  ('strategy'),
  ('party'),
  ('word'),
  ('team'),
  ('war'),
  ('factions'),
  ('tile-laying'),
  ('nature'),
  ('solo'),
  ('zoo'),
  ('heavy'),
  ('abstract'),
  ('drafting'),
  ('family');

-- Add sample collection data for Kirito
INSERT INTO public.collections (player_id, game_id, collection_type, rulebook_url, is_manual)
SELECT 
  p.id as player_id,
  g.id as game_id,
  CASE 
    WHEN g.name IN ('Wingspan', 'Codenames', 'Root') THEN 'owned'::collection_type_enum
    ELSE 'wishlist'::collection_type_enum
  END as collection_type,
  CASE 
    WHEN g.name = 'Wingspan' THEN 'https://example.com/wingspan-rules.pdf'
    WHEN g.name = 'Root' THEN 'https://example.com/root-rules.pdf'
    ELSE NULL
  END as rulebook_url,
  true as is_manual
FROM public.players p
CROSS JOIN public.games g
WHERE p.name = 'Kirito' 
LIMIT 10;

-- Add sample tags for the collections
DO $$
DECLARE
  wingspan_collection_id UUID;
  codenames_collection_id UUID;
  root_collection_id UUID;
BEGIN
  -- Get collection IDs
  SELECT c.id INTO wingspan_collection_id 
  FROM collections c 
  JOIN games g ON c.game_id = g.id 
  JOIN players p ON c.player_id = p.id 
  WHERE g.name = 'Wingspan' AND p.name = 'Kirito';
  
  SELECT c.id INTO codenames_collection_id 
  FROM collections c 
  JOIN games g ON c.game_id = g.id 
  JOIN players p ON c.player_id = p.id 
  WHERE g.name = 'Codenames' AND p.name = 'Kirito';
  
  SELECT c.id INTO root_collection_id 
  FROM collections c 
  JOIN games g ON c.game_id = g.id 
  JOIN players p ON c.player_id = p.id 
  WHERE g.name = 'Root' AND p.name = 'Kirito';

  -- Add tags for Wingspan
  IF wingspan_collection_id IS NOT NULL THEN
    INSERT INTO collection_tags (collection_id, tag_id)
    SELECT wingspan_collection_id, t.id 
    FROM tags t 
    WHERE t.name IN ('engine-builder', 'birds', 'strategy');
  END IF;

  -- Add tags for Codenames
  IF codenames_collection_id IS NOT NULL THEN
    INSERT INTO collection_tags (collection_id, tag_id)
    SELECT codenames_collection_id, t.id 
    FROM tags t 
    WHERE t.name IN ('party', 'word', 'team');
  END IF;

  -- Add tags for Root
  IF root_collection_id IS NOT NULL THEN
    INSERT INTO collection_tags (collection_id, tag_id)
    SELECT root_collection_id, t.id 
    FROM tags t 
    WHERE t.name IN ('war', 'factions', 'strategy');
  END IF;
END $$;
