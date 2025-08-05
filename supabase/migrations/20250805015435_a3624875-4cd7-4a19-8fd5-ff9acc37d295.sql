-- Fix collections table to reference game_catalog properly
-- First drop the existing game_id column and add the correct one

ALTER TABLE collections DROP COLUMN game_id;
ALTER TABLE collections ADD COLUMN catalog_game_id integer NOT NULL;

-- Add foreign key constraint to reference game_catalog
ALTER TABLE collections 
ADD CONSTRAINT collections_catalog_game_id_fkey 
FOREIGN KEY (catalog_game_id) 
REFERENCES game_catalog(game_id);