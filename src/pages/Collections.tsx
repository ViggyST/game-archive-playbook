
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, BookOpen, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePlayerCollections } from '@/hooks/usePlayerCollections';
import { EnhancedAddGameModal } from '@/components/collections/EnhancedAddGameModal';
import { usePlayerContext } from '@/context/PlayerContext';

const Collections = () => {
  const navigate = useNavigate();
  const { player } = usePlayerContext();
  const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'owned' | 'wishlist'>('owned');

  const { data: ownedGames = [], isLoading: isLoadingOwned } = usePlayerCollections('owned');
  const { data: wishlistGames = [], isLoading: isLoadingWishlist } = usePlayerCollections('wishlist');

  if (!player) {
    navigate('/');
    return null;
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity?.toLowerCase()) {
      case 'light':
        return 'bg-green-500';
      case 'medium':
        return 'bg-blue-500';
      case 'heavy':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const CollectionCard = ({ item }: { item: any }) => (
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
              {item.game_name}
            </CardTitle>
            {/* Show catalog info if available */}
            {!item.is_manual && (
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>Catalog Game</span>
              </div>
            )}
          </div>
          <div className={`w-3 h-3 rounded-full ${getComplexityColor(item.complexity)} border border-white shadow-sm`} />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Game thumbnail */}
          {item.cover_url && (
            <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={item.cover_url} 
                alt={item.game_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Game Info */}
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">Complexity:</span>
              <span className="capitalize">{item.complexity}</span>
            </div>
            {item.publisher && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Publisher:</span>
                <span>{item.publisher}</span>
              </div>
            )}
            {item.players && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{item.players}</span>
              </div>
            )}
          </div>

          {/* Notes */}
          {item.notes && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Notes:</span>
              <p className="mt-1 text-xs">{item.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {item.rulebook_url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(item.rulebook_url, '_blank')}
                className="flex items-center gap-1"
              >
                <BookOpen className="w-4 h-4" />
                Rules
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">🎒 My Collection</h1>
              <p className="text-sm text-gray-600">View owned games & wishlist</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 pb-20">
        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as 'owned' | 'wishlist')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="owned">🎮 Owned ({ownedGames.length})</TabsTrigger>
            <TabsTrigger value="wishlist">📝 Wishlist ({wishlistGames.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="owned" className="space-y-4">
            {isLoadingOwned ? (
              <div className="text-center py-8">
                <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-gray-600">Loading your collection...</p>
              </div>
            ) : ownedGames.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎮</div>
                <p className="text-gray-600 mb-6">No games in your collection yet!</p>
                <p className="text-sm text-gray-500 mb-4">Tap the + button to add your first game</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {ownedGames.map((game) => (
                  <CollectionCard key={game.id} item={game} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-4">
            {isLoadingWishlist ? (
              <div className="text-center py-8">
                <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-gray-600">Loading your wishlist...</p>
              </div>
            ) : wishlistGames.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-600 mb-6">No games in your wishlist yet!</p>
                <p className="text-sm text-gray-500 mb-4">Tap the + button to add games you want</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {wishlistGames.map((game) => (
                  <CollectionCard key={game.id} item={game} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsAddGameModalOpen(true)}
          className="w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-200 hover:scale-110"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Enhanced Add Game Modal */}
      <EnhancedAddGameModal
        isOpen={isAddGameModalOpen}
        onClose={() => setIsAddGameModalOpen(false)}
        defaultCollectionType={selectedTab}
      />
    </div>
  );
};

export default Collections;
