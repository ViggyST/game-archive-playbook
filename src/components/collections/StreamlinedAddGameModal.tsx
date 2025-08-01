
import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
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
import { usePlayerCollections } from '@/hooks/usePlayerCollections';

interface StreamlinedAddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCollectionType: 'owned' | 'wishlist';
}

export const StreamlinedAddGameModal: React.FC<StreamlinedAddGameModalProps> = ({ isOpen, onClose, defaultCollectionType }) => {
  const { player } = usePlayerContext();
  const queryClient = useQueryClient();
  
  // Get existing collections to check for duplicates
  const { data: ownedGames = [] } = usePlayerCollections('owned');
  const { data: wishlistGames = [] } = usePlayerCollections('wishlist');
  
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

  const checkIfGameExists = (gameTitle: string) => {
    const allGames = [...ownedGames, ...wishlistGames];
    return allGames.find(game => 
      game.game_name.toLowerCase().trim() === gameTitle.toLowerCase().trim()
    );
  };

  const handleGameSelect = (catalogGame: GameCatalogItem) => {
    console.log('Selecting catalog game:', catalogGame);
    const existingGame = checkIfGameExists(catalogGame.title);
    if (existingGame) {
      const collectionTypeText = ownedGames.find(g => g.id === existingGame.id) ? 'owned collection' : 'wishlist';
      toast.error(`🎲 "${catalogGame.title}" is already in your ${collectionTypeText}`);
      return;
    }
    setSelectedGame(catalogGame);
    setSearchQuery('');
  };

  const handleManualEntry = () => {
    const existingGame = checkIfGameExists(searchQuery);
    if (existingGame) {
      const collectionTypeText = ownedGames.find(g => g.id === existingGame.id) ? 'owned collection' : 'wishlist';
      toast.error(`🎲 "${searchQuery}" is already in your ${collectionTypeText}`);
      return;
    }
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
    if (!player?.id) {
      toast.error('Please select a player first');
      return;
    }

    const gameTitle = selectedGame?.title || manualTitle.trim();
    if (!gameTitle) {
      toast.error('Please enter a game title');
      return;
    }

    // Final duplicate check before submission
    const existingGame = checkIfGameExists(gameTitle);
    if (existingGame) {
      const collectionTypeText = ownedGames.find(g => g.id === existingGame.id) ? 'owned collection' : 'wishlist';
      toast.error(`🎲 "${gameTitle}" is already in your ${collectionTypeText}`);
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Starting collection entry submission:', {
        gameTitle,
        selectedGame: selectedGame?.title,
        isManual: !selectedGame,
        collectionType
      });

      // Insert directly into collections table
      const collectionData: any = {
        player_id: player.id,
        game_title: gameTitle,
        collection_type: collectionType,
        notes: notes || null,
        is_manual: !selectedGame
      };

      // Add catalog data if from BGG
      if (selectedGame) {
        collectionData.catalog_game_id = selectedGame.game_id;
        collectionData.thumbnail_url = selectedGame.thumbnail || null;
        collectionData.description = selectedGame.description || null;
        collectionData.bgg_rank = selectedGame.rank || null;
        collectionData.geek_rating = selectedGame.geek_rating || null;
        collectionData.year_published = selectedGame.year || null;
        collectionData.bgg_link = selectedGame.link || null;
      } else {
        // Manual entry
        collectionData.description = manualDescription || null;
      }

      const { data: collection, error: collectionError } = await supabase
        .from('collections')
        .insert(collectionData)
        .select('id')
        .single();

      if (collectionError) {
        console.error('Error adding to collection:', collectionError);
        throw collectionError;
      }

      console.log('Added to collection:', collection.id);

      // Add tags if any
      if (tags.length > 0 && collection) {
        for (const tagName of tags) {
          // Insert tag if it doesn't exist
          const { data: tag, error: tagError } = await supabase
            .from('tags')
            .upsert({ name: tagName })
            .select('id')
            .single();

          if (tagError) {
            console.error('Error creating tag:', tagError);
            continue; // Skip this tag but don't fail the whole operation
          }

          if (tag) {
            // Link tag to collection
            const { error: linkError } = await supabase
              .from('collection_tags')
              .insert({
                collection_id: collection.id,
                tag_id: tag.id
              });

            if (linkError) {
              console.error('Error linking tag:', linkError);
              // Continue - don't fail for tag linking issues
            }
          }
        }
      }

      // Refresh the collections data
      queryClient.invalidateQueries({ queryKey: ['player-collections'] });
      
      toast.success(`🎮 "${gameTitle}" added to your ${collectionType}!`);
      handleClose();
    } catch (error) {
      console.error('Error adding game:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to add game: ${errorMessage}`);
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
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent className="h-[95vh] flex flex-col">
        <DrawerHeader className="flex-shrink-0">
          <DrawerTitle>Add Game to Collection</DrawerTitle>
        </DrawerHeader>
        
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Game Selection Section */}
            {!selectedGame && !showManualEntry ? (
              <div className="space-y-4">
                <div className="space-y-3">
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
                  </div>
                </div>

                {/* Search Results - Always visible when typing */}
                {searchQuery && (
                  <div className="space-y-2">
                    {isSearching ? (
                      <div className="text-center py-8">
                        <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                        <p className="text-gray-600">Searching catalog...</p>
                      </div>
                    ) : catalogResults.length > 0 ? (
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-600">Found in BGG Catalog:</Label>
                        <div className="max-h-64 overflow-y-auto space-y-2">
                          {catalogResults.slice(0, 5).map((game) => (
                            <div
                              key={game.game_id}
                              onClick={() => handleGameSelect(game)}
                              className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                  {game.thumbnail ? (
                                    <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">🎲</div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-900 truncate">{game.title}</h4>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    {game.year && <span>{game.year}</span>}
                                    {game.rank && <span>• Rank #{game.rank}</span>}
                                    {game.geek_rating && <span>• ⭐ {game.geek_rating}</span>}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 border rounded-lg bg-gray-50">
                        <p className="text-gray-600 mb-3">No games found in catalog</p>
                        <Button variant="outline" onClick={handleManualEntry}>
                          Add "{searchQuery}" manually
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : selectedGame ? (
              /* Selected Catalog Game Preview */
              <div className="space-y-4">
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
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Manual Entry</Label>
                  <Button variant="ghost" size="sm" onClick={clearSelection}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-3">
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
        </div>
      </DrawerContent>
    </Drawer>
  );
};
