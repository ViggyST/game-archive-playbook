
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { X, Search, Star, Users } from 'lucide-react';
import { usePlayerContext } from '@/context/PlayerContext';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useGameCatalogSearch, GameCatalogItem } from '@/hooks/useGameCatalogSearch';

interface EnhancedAddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCollectionType: 'owned' | 'wishlist';
}

export const EnhancedAddGameModal = ({ isOpen, onClose, defaultCollectionType }: EnhancedAddGameModalProps) => {
  const { player } = usePlayerContext();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatalogGame, setSelectedCatalogGame] = useState<GameCatalogItem | null>(null);
  const [isManualEntry, setIsManualEntry] = useState(false);
  
  // Form fields
  const [gameName, setGameName] = useState('');
  const [gameDescription, setGameDescription] = useState('');
  const [rulebookUrl, setRulebookUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [collectionType, setCollectionType] = useState<'owned' | 'wishlist'>(defaultCollectionType);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: catalogResults = [], isLoading: isSearching } = useGameCatalogSearch(searchQuery);

  const handleCatalogSelect = (catalogGame: GameCatalogItem) => {
    setSelectedCatalogGame(catalogGame);
    setGameName(catalogGame.title);
    setGameDescription(catalogGame.description || '');
    setSearchQuery('');
    setIsManualEntry(false);
  };

  const handleManualEntry = () => {
    setSelectedCatalogGame(null);
    setIsManualEntry(true);
    setGameName(searchQuery);
    setSearchQuery('');
  };

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
      let gameId = null;

      if (selectedCatalogGame) {
        // First, check if this catalog game already exists in our games table
        let { data: existingGame } = await supabase
          .from('games')
          .select('id')
          .eq('name', selectedCatalogGame.title)
          .single();

        if (!existingGame) {
          // Create new game entry linked to catalog
          const { data: newGame, error: gameError } = await supabase
            .from('games')
            .insert({
              name: selectedCatalogGame.title,
              cover_url: selectedCatalogGame.thumbnail || null,
              weight: 'Medium' // Default weight
            })
            .select('id')
            .single();

          if (gameError) throw gameError;
          gameId = newGame.id;
        } else {
          gameId = existingGame.id;
        }
      } else {
        // Manual entry - create new game
        const { data: newGame, error: gameError } = await supabase
          .from('games')
          .insert({
            name: gameName.trim(),
            weight: 'Medium' // Default weight
          })
          .select('id')
          .single();

        if (gameError) throw gameError;
        gameId = newGame.id;
      }

      // Add to collection
      const { data: collection, error: collectionError } = await supabase
        .from('collections')
        .insert({
          player_id: player.id,
          game_id: gameId,
          collection_type: collectionType,
          rulebook_url: rulebookUrl || null,
          notes: notes || null,
          is_manual: !selectedCatalogGame
        })
        .select('id')
        .single();

      if (collectionError) throw collectionError;

      // Add tags if any
      if (tags.length > 0 && collection) {
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
    setSearchQuery('');
    setSelectedCatalogGame(null);
    setIsManualEntry(false);
    setGameName('');
    setGameDescription('');
    setRulebookUrl('');
    setNotes('');
    setTags([]);
    setNewTag('');
    setCollectionType(defaultCollectionType);
    onClose();
  };

  const showForm = selectedCatalogGame || isManualEntry;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Game to Collection</DialogTitle>
        </DialogHeader>
        
        {!showForm ? (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for a game..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {searchQuery && (
              <div className="space-y-2">
                {isSearching ? (
                  <div className="text-center py-4">
                    <div className="animate-spin w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
                  </div>
                ) : catalogResults.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {catalogResults.map((game) => (
                      <Card key={game.game_id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCatalogSelect(game)}>
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-sm font-medium">
                              {game.title}
                              {game.rank && <span className="text-xs text-gray-500 ml-2">(#{game.rank})</span>}
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {game.description && (
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{game.description}</p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            {game.geek_rating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span>{game.geek_rating}</span>
                                {game.voters && <span className="text-gray-400">({game.voters})</span>}
                              </div>
                            )}
                            {game.year && <span>{game.year}</span>}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-600 mb-2">No games found</p>
                    <Button variant="outline" onClick={handleManualEntry}>
                      Add "{searchQuery}" manually
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gameName">Game Name *</Label>
              <Input
                id="gameName"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                placeholder="Enter board game name"
                required
                disabled={!!selectedCatalogGame}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gameDescription">Description</Label>
              <Textarea
                id="gameDescription"
                value={gameDescription}
                onChange={(e) => setGameDescription(e.target.value)}
                placeholder="Game description"
                rows={3}
                disabled={!!selectedCatalogGame}
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
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Personal notes about this game"
                rows={3}
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
        )}
      </DialogContent>
    </Dialog>
  );
};
