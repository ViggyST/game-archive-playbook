-- Drop the existing constraint
ALTER TABLE tags DROP CONSTRAINT IF EXISTS tags_tag_type_check;

-- Re-add the constraint with the new allowed value
ALTER TABLE tags ADD CONSTRAINT tags_tag_type_check 
CHECK (tag_type IN ('mechanic', 'player-count', 'theme', 'weight', 'miscellaneous'));