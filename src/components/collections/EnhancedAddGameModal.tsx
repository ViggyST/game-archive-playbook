
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Star, ArrowLeft } from 'lucide-react';
import { usePlayerContext } from '@/context/PlayerContext';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useGameCatalogSearch, GameCatalogItem } from '@/hooks/useGameCatalogSearch';
import { GameSearchResult } from './GameSearchResult';
import { TagSelector } from './TagSelector';

interface EnhancedAddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCollectionType: 'owned' | 'wishlist';
}

export const EnhancedAddGameModal = ({ isOpen, onClose, defaultCollectionType }: EnhancedAddGameModalProps) => {
  const { player } = usePlayerContext();
  const queryClient = useQueryClient();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatalogGame, setSelectedCatalogGame] = useState<GameCatalogItem | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  
  // Form fields
  const [gameName, setGameName] = useState('');
  const [gameDescription, setGameDescription] = useState('');
  const [rulebookUrl, setRulebookUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [collectionType, setCollectionType] = useState<'owned' | 'wishlist'>(defaultCollectionType);
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: catalogResults = [], isLoading: isSearching } = useGameCatalogSearch(searchQuery);

  const handleCatalogSelect = (catalogGame: GameCatalogItem) => {
    setSelectedCatalogGame(catalogGame);
    setGameName(catalogGame.title);
    setGameDescription(catalogGame.description || '');
    setShowManualEntry(false);
  };

  const handleManualEntry = () => {
    setSelectedCatalogGame(null);
    setShowManualEntry(true);
    setGameName(searchQuery);
    setGameDescription('');
  };

  const handleBackToSearch = () => {
    setSelectedCatalogGame(null);
    setShowManualEntry(false);
    setGameName('');
    setGameDescription('');
    setTags([]);
    setRulebookUrl('');
    setNotes('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!player?.id || !gameName.trim()) return;

    setIsSubmitting(true);

    try {
      let gameId = null;

      if (selectedCatalogGame) {
        // Check if this catalog game already exists in our games table
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
            name: gameName.trim(),
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
          catalog_game_id: gameId,
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
      
      toast.success(`🎮 "${gameName}" added to your ${collectionType}!`);
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
    setShowManualEntry(false);
    setGameName('');
    setGameDescription('');
    setRulebookUrl('');
    setNotes('');
    setTags([]);
    setCollectionType(defaultCollectionType);
    onClose();
  };

  const isInFormMode = selectedCatalogGame || showManualEntry;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isInFormMode && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToSearch}
                className="p-1 -ml-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            Add Game to Collection
          </DialogTitle>
        </DialogHeader>
        
        {!isInFormMode ? (
          /* Search Phase */
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for a board game..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>

            {searchQuery && (
              <div className="space-y-3">
                {isSearching ? (
                  <div className="text-center py-6">
                    <div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Searching games...</p>
                  </div>
                ) : catalogResults.length > 0 ? (
                  <>
                    <p className="text-sm text-gray-600 px-1">
                      Found {catalogResults.length} game{catalogResults.length !== 1 ? 's' : ''}
                    </p>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {catalogResults.map((game) => (
                        <GameSearchResult
                          key={game.game_id}
                          game={game}
                          onClick={handleCatalogSelect}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-4xl mb-3">🎯</div>
                    <p className="text-gray-600 mb-3">No games found</p>
                    <Button variant="outline" onClick={handleManualEntry}>
                      Add "{searchQuery}" manually
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Form Phase */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Selected Game Preview */}
            {selectedCatalogGame && (
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">🎮</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedCatalogGame.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        {selectedCatalogGame.rank && (
                          <span>Rank #{selectedCatalogGame.rank}</span>
                        )}
                        {selectedCatalogGame.geek_rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{selectedCatalogGame.geek_rating}</span>
                          </div>
                        )}
                        {selectedCatalogGame.year && <span>{selectedCatalogGame.year}</span>}
                      </div>
                    </div>
                  </div>
                  {selectedCatalogGame.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {selectedCatalogGame.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Manual Entry Fields */}
            {showManualEntry && (
              <div className="space-y-4">
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
                  <Label htmlFor="gameDescription">Description</Label>
                  <Textarea
                    id="gameDescription"
                    value={gameDescription}
                    onChange={(e) => setGameDescription(e.target.value)}
                    placeholder="Brief game description (optional)"
                    rows={2}
                  />
                </div>
              </div>
            )}

            {/* Collection Type */}
            <div className="space-y-3">
              <Label>Add to:</Label>
              <RadioGroup 
                value={collectionType} 
                onValueChange={(value) => setCollectionType(value as 'owned' | 'wishlist')}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="owned" id="owned" />
                  <Label htmlFor="owned" className="cursor-pointer">🎮 My Collection</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wishlist" id="wishlist" />
                  <Label htmlFor="wishlist" className="cursor-pointer">📝 Wishlist</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Tags */}
            <TagSelector selectedTags={tags} onTagsChange={setTags} />

            {/* Optional Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rulebookUrl">Rulebook URL</Label>
                <Input
                  id="rulebookUrl"
                  value={rulebookUrl}
                  onChange={(e) => setRulebookUrl(e.target.value)}
                  placeholder="Link to rulebook PDF (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Personal Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Your thoughts about this game (optional)"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !gameName.trim()}>
                {isSubmitting ? 'Adding...' : `Add to ${collectionType === 'owned' ? 'Collection' : 'Wishlist'}`}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
