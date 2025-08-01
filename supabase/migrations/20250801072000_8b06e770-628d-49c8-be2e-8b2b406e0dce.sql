
-- Step 1: Remove tag links from collection_tags
DELETE FROM collection_tags 
WHERE tag_id IN (
  SELECT id FROM tags WHERE name IN ('component', 'experience', 'structure')
);

-- Step 2: Remove tags from tags table
DELETE FROM tags 
WHERE name IN ('component', 'experience', 'structure');
