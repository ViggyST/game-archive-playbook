
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Search, X } from 'lucide-react';
import { usePlayerContext } from '@/context/PlayerContext';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useGameCatalogSearch, GameCatalogItem } from '@/hooks/useGameCatalogSearch';
import { GameSearchDropdown } from './GameSearchDropdown';
import { SelectedGamePreview } from './SelectedGamePreview';
import { TagSelector } from './TagSelector';

interface StreamlinedAddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCollectionType: 'owned' | 'wishlist';
}

export const StreamlinedAddGameModal = ({ isOpen, onClose, defaultCollectionType }: StreamlinedAddGameModalProps) => {
  const { player } = usePlayerContext();
  const queryClient = useQueryClient();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<GameCatalogItem | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  
  // Form fields
  const [manualTitle, setManualTitle] = useState('');
  const [manualDescription, setManualDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [collectionType, setCollectionType] = useState<'owned' | 'wishlist'>(defaultCollectionType);
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: catalogResults = [], isLoading: isSearching } = useGameCatalogSearch(searchQuery);

  const handleGameSelect = (catalogGame: GameCatalogItem) => {
    setSelectedGame(catalogGame);
    setSearchQuery('');
  };

  const handleManualEntry = () => {
    setShowManualEntry(true);
    setManualTitle(searchQuery);
    setSearchQuery('');
  };

  const clearSelection = () => {
    setSelectedGame(null);
    setShowManualEntry(false);
    setManualTitle('');
    setManualDescription('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!player?.id) return;

    const gameTitle = selectedGame?.title || manualTitle.trim();
    if (!gameTitle) return;

    setIsSubmitting(true);

    try {
      let gameId = null;

      if (selectedGame) {
        // Check if this catalog game already exists in our games table
        let { data: existingGame } = await supabase
          .from('games')
          .select('id')
          .eq('name', selectedGame.title)
          .single();

        if (!existingGame) {
          // Create new game entry from catalog
          const { data: newGame, error: gameError } = await supabase
            .from('games')
            .insert({
              name: selectedGame.title,
              cover_url: selectedGame.thumbnail || null,
              weight: 'Medium'
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
            name: manualTitle.trim(),
            weight: 'Medium'
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
          notes: notes || null,
          is_manual: !selectedGame
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
      
      toast.success(`🎮 "${gameTitle}" added to your ${collectionType}!`);
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
    setSelectedGame(null);
    setShowManualEntry(false);
    setManualTitle('');
    setManualDescription('');
    setNotes('');
    setTags([]);
    setCollectionType(defaultCollectionType);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Game to Collection</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Game Selection Section */}
          {!selectedGame && !showManualEntry ? (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Search for a game</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Start typing a game name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    autoFocus
                  />
                  <GameSearchDropdown
                    games={catalogResults}
                    onSelect={handleGameSelect}
                    isLoading={isSearching}
                  />
                </div>
              </div>

              {searchQuery && catalogResults.length === 0 && !isSearching && (
                <div className="text-center py-4 border rounded-lg bg-gray-50">
                  <p className="text-gray-600 mb-3">No games found in catalog</p>
                  <Button variant="outline" onClick={handleManualEntry}>
                    Add "{searchQuery}" manually
                  </Button>
                </div>
              )}
            </div>
          ) : selectedGame ? (
            /* Selected Catalog Game Preview */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Selected Game</Label>
                <Button variant="ghost" size="sm" onClick={clearSelection}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <SelectedGamePreview game={selectedGame} />
            </div>
          ) : (
            /* Manual Entry */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Manual Entry</Label>
                <Button variant="ghost" size="sm" onClick={clearSelection}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="manualTitle">Game Title *</Label>
                <Input
                  id="manualTitle"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="Enter game title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manualDescription">Description (optional)</Label>
                <Textarea
                  id="manualDescription"
                  value={manualDescription}
                  onChange={(e) => setManualDescription(e.target.value)}
                  placeholder="Brief description of the game"
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* Collection Type */}
          {(selectedGame || showManualEntry) && (
            <>
              <div className="space-y-3">
                <Label>Add to:</Label>
                <RadioGroup 
                  value={collectionType} 
                  onValueChange={(value) => setCollectionType(value as 'owned' | 'wishlist')}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="owned" id="owned" />
                    <Label htmlFor="owned" className="cursor-pointer">🎮 Owned</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="wishlist" id="wishlist" />
                    <Label htmlFor="wishlist" className="cursor-pointer">📝 Wishlist</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Tags */}
              <TagSelector selectedTags={tags} onTagsChange={setTags} />

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Personal Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Your thoughts about this game"
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || (!selectedGame?.title && !manualTitle.trim())}
                >
                  {isSubmitting ? 'Adding...' : `Add to ${collectionType === 'owned' ? 'Collection' : 'Wishlist'}`}
                </Button>
              </div>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};
