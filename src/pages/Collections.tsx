
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, BookOpen, Users, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePlayerCollections } from '@/hooks/usePlayerCollections';
import { AddGameModal } from '@/components/collections/AddGameModal';
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
          <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
            {item.game_name}
          </CardTitle>
          <div className={`w-3 h-3 rounded-full ${getComplexityColor(item.complexity)} border border-white shadow-sm`} />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
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
      <div className="max-w-md mx-auto px-4 py-6">
        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as 'owned' | 'wishlist')}>
          <div className="flex items-center justify-between mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="owned">🎮 Games Owned</TabsTrigger>
              <TabsTrigger value="wishlist">📝 Wishlist</TabsTrigger>
            </TabsList>
            <Button
              onClick={() => setIsAddGameModalOpen(true)}
              className="ml-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Game
            </Button>
          </div>

          <TabsContent value="owned" className="space-y-4">
            {isLoadingOwned ? (
              <div className="text-center py-8">
                <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-gray-600">Loading your collection...</p>
              </div>
            ) : ownedGames.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🎮</div>
                <p className="text-gray-600 mb-4">No games in your collection yet!</p>
                <Button onClick={() => setIsAddGameModalOpen(true)}>
                  Add your first game
                </Button>
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
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📝</div>
                <p className="text-gray-600 mb-4">No games in your wishlist yet!</p>
                <Button onClick={() => setIsAddGameModalOpen(true)}>
                  Add your first wishlist game
                </Button>
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

      {/* Add Game Modal */}
      <AddGameModal
        isOpen={isAddGameModalOpen}
        onClose={() => setIsAddGameModalOpen(false)}
        defaultCollectionType={selectedTab}
      />
    </div>
  );
};

export default Collections;
