-- First, delete existing collections since they reference the wrong table
DELETE FROM collections;

-- Now fix the schema
ALTER TABLE collections DROP COLUMN game_id;
ALTER TABLE collections ADD COLUMN catalog_game_id integer NOT NULL;

-- Add foreign key constraint to reference game_catalog
ALTER TABLE collections 
ADD CONSTRAINT collections_catalog_game_id_fkey 
FOREIGN KEY (catalog_game_id) 
REFERENCES game_catalog(game_id);