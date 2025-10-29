
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePlayerCollections } from '@/hooks/usePlayerCollections';
import { StreamlinedAddGameModal } from '@/components/collections/StreamlinedAddGameModal';
import { EnhancedCollectionCard } from '@/components/collections/EnhancedCollectionCard';
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

  return (
    <div className="min-h-screen bg-[var(--bg)] relative">
      {/* Header */}
      <div className="bg-[var(--surface)] shadow-sm border-b border-[var(--border)]">
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
              <h1 className="text-xl font-bold text-[var(--text-primary)]">🎒 My Collection</h1>
              <p className="text-sm text-[var(--text-secondary)]">View owned games & wishlist</p>
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
                <p className="text-[var(--text-secondary)]">Loading your collection...</p>
              </div>
            ) : ownedGames.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎮</div>
                <p className="text-[var(--text-secondary)] mb-6">No games in your collection yet!</p>
                <p className="text-sm text-[var(--text-secondary)] mb-4">Tap the + button to add your first game</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {ownedGames.map((game) => (
                  <EnhancedCollectionCard key={game.id} item={game} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-4">
            {isLoadingWishlist ? (
              <div className="text-center py-8">
                <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-[var(--text-secondary)]">Loading your wishlist...</p>
              </div>
            ) : wishlistGames.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-[var(--text-secondary)] mb-6">No games in your wishlist yet!</p>
                <p className="text-sm text-[var(--text-secondary)] mb-4">Tap the + button to add games you want</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {wishlistGames.map((game) => (
                  <EnhancedCollectionCard key={game.id} item={game} />
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

      {/* Streamlined Add Game Modal */}
      <StreamlinedAddGameModal
        isOpen={isAddGameModalOpen}
        onClose={() => setIsAddGameModalOpen(false)}
        defaultCollectionType={selectedTab}
      />
    </div>
  );
};

export default Collections;
