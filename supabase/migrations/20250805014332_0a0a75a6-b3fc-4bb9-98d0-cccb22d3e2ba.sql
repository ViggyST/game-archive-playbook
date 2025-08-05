-- Remove specific tags: component, experience, structure
-- First, remove any collection_tag relationships
DELETE FROM collection_tags 
WHERE tag_id IN (
  SELECT id FROM tags 
  WHERE name IN ('component', 'experience', 'structure')
);

-- Then remove the tags themselves
DELETE FROM tags 
WHERE name IN ('component', 'experience', 'structure');