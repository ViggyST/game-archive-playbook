
import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePlayerCollections } from "@/hooks/usePlayerCollections";
import GameCard from "@/components/collections/GameCard";
import AddGameModal from "@/components/collections/AddGameModal";

const Collections = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("owned");
  const [showAddModal, setShowAddModal] = useState(false);
  const { ownedGames, wishlistGames, isLoading } = usePlayerCollections();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading collection...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-inter text-sm">Back</span>
          </button>
          <div className="text-center">
            <h1 className="font-poppins font-bold text-xl text-gray-900">
              🎒 My Collection
            </h1>
            <p className="font-inter text-sm text-gray-500">
              Manage your games & wishlist
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            size="sm"
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-full"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-2">
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setActiveTab("owned")}
              className={`
                group flex items-center justify-center gap-2 py-4 px-4 rounded-xl font-medium text-sm 
                transition-all duration-200
                ${activeTab === "owned" 
                  ? 'bg-purple-100 text-purple-700 shadow-sm border border-purple-200' 
                  : 'hover:bg-gray-50 text-gray-600 hover:text-gray-700'
                }
              `}
            >
              <span className="text-lg">🎮</span>
              <span>Owned Games ({ownedGames.length})</span>
            </button>
            
            <button
              onClick={() => setActiveTab("wishlist")}
              className={`
                group flex items-center justify-center gap-2 py-4 px-4 rounded-xl font-medium text-sm 
                transition-all duration-200
                ${activeTab === "wishlist" 
                  ? 'bg-purple-100 text-purple-700 shadow-sm border border-purple-200' 
                  : 'hover:bg-gray-50 text-gray-600 hover:text-gray-700'
                }
              `}
            >
              <span className="text-lg">📝</span>
              <span>Wishlist ({wishlistGames.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 pb-8">
        {activeTab === "owned" && (
          <div className="space-y-4">
            {ownedGames.length > 0 ? (
              ownedGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="font-poppins font-semibold text-lg text-gray-700 mb-2">
                  No games yet!
                </h3>
                <p className="font-inter text-sm text-gray-500 mb-6">
                  Start building your collection by adding games you own.
                </p>
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Game
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "wishlist" && (
          <div className="space-y-4">
            {wishlistGames.length > 0 ? (
              wishlistGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="font-poppins font-semibold text-lg text-gray-700 mb-2">
                  Empty wishlist!
                </h3>
                <p className="font-inter text-sm text-gray-500 mb-6">
                  Add games you'd like to acquire to your wishlist.
                </p>
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Wishlist
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Game Modal */}
      <AddGameModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        defaultType={activeTab as 'owned' | 'wishlist'}
      />
    </div>
  );
};

export default Collections;
