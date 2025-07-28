
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { usePlayerContext } from '@/context/PlayerContext';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCollectionType: 'owned' | 'wishlist';
}

export const AddGameModal = ({ isOpen, onClose, defaultCollectionType }: AddGameModalProps) => {
  const { player } = usePlayerContext();
  const queryClient = useQueryClient();
  
  const [gameName, setGameName] = useState('');
  const [complexity, setComplexity] = useState<string>('');
  const [publisher, setPublisher] = useState('');
  const [rulebookUrl, setRulebookUrl] = useState('');
  const [collectionType, setCollectionType] = useState<'owned' | 'wishlist'>(defaultCollectionType);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!player?.id || !gameName.trim()) return;

    setIsSubmitting(true);

    try {
      // First, check if game exists in games table
      let { data: existingGame } = await supabase
        .from('games')
        .select('id')
        .eq('name', gameName.trim())
        .single();

      let gameId;
      
      if (!existingGame) {
        // Create new game
        const { data: newGame, error: gameError } = await supabase
          .from('games')
          .insert({
            name: gameName.trim(),
            weight: complexity || 'Medium'
          })
          .select('id')
          .single();

        if (gameError) throw gameError;
        gameId = newGame.id;
      } else {
        gameId = existingGame.id;
      }

      // Add to collection
      const { error: collectionError } = await supabase
        .from('collections')
        .insert({
          player_id: player.id,
          game_id: gameId,
          collection_type: collectionType,
          rulebook_url: rulebookUrl || null,
          is_manual: true
        });

      if (collectionError) throw collectionError;

      // Add tags if any
      if (tags.length > 0) {
        // First, get the collection ID
        const { data: collection } = await supabase
          .from('collections')
          .select('id')
          .eq('player_id', player.id)
          .eq('game_id', gameId)
          .eq('collection_type', collectionType)
          .single();

        if (collection) {
          // Insert tags and get their IDs
          for (const tagName of tags) {
            // Insert tag if it doesn't exist
            const { data: tag } = await supabase
              .from('tags')
              .upsert({ name: tagName })
              .select('id')
              .single();

            if (tag) {
              // Link tag to collection
              await supabase
                .from('collection_tags')
                .insert({
                  collection_id: collection.id,
                  tag_id: tag.id
                });
            }
          }
        }
      }

      // Refresh the collections data
      queryClient.invalidateQueries({ queryKey: ['player-collections'] });
      
      toast.success(`Game added to your ${collectionType}!`);
      handleClose();
    } catch (error) {
      console.error('Error adding game:', error);
      toast.error('Failed to add game. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setGameName('');
    setComplexity('');
    setPublisher('');
    setRulebookUrl('');
    setTags([]);
    setNewTag('');
    setCollectionType(defaultCollectionType);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Game to Collection</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gameName">Game Name *</Label>
            <Input
              id="gameName"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Enter board game name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="complexity">Complexity</Label>
            <Select value={complexity} onValueChange={setComplexity}>
              <SelectTrigger>
                <SelectValue placeholder="Select complexity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Light">Light</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Heavy">Heavy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="publisher">Publisher</Label>
            <Input
              id="publisher"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              placeholder="Enter publisher name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rulebookUrl">Rulebook URL</Label>
            <Input
              id="rulebookUrl"
              value={rulebookUrl}
              onChange={(e) => setRulebookUrl(e.target.value)}
              placeholder="Paste rulebook PDF URL"
            />
          </div>

          <div className="space-y-2">
            <Label>Add to:</Label>
            <RadioGroup value={collectionType} onValueChange={(value) => setCollectionType(value as 'owned' | 'wishlist')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="owned" id="owned" />
                <Label htmlFor="owned">My Collection</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="wishlist" id="wishlist" />
                <Label htmlFor="wishlist">Wishlist</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !gameName.trim()}>
              {isSubmitting ? 'Adding...' : 'Add Game'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
