import { useState } from "react";
import { Trophy, Clock, Gamepad2, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePlayerGameDashboard } from "@/hooks/usePlayerGameDashboard";
import GameSessionHistoryModal from "./GameSessionHistoryModal";

const GamesDashboard = () => {
  const [sortBy, setSortBy] = useState<'plays' | 'recent'>('plays');
  const [selectedGame, setSelectedGame] = useState<{ id: string; name: string } | null>(null);
  
  // Using Kirito's player ID as specified
  const playerId = '3db5dc38-1f5d-499f-bece-b1c20e31f838';
  
  const { data: games = [], isLoading, error } = usePlayerGameDashboard(playerId, sortBy);

  const gameIconMap: Record<string, string> = {
    "Saboteur": "🌊",
    "Everdell": "🗺️",
    "Viticulture": "🍇",
    "Wingspan Oceania": "🐦",
    "Let's make a bus route": "🚌",
    "Castles of Burgundy": "🏰",
    "Marvel Remix": "🧙‍♂️",
    "Final Girl": "🪓",
    "Risk: Game of Thrones": "🗺️",
    "Sagrada": "🧱",
    "Chess": "♟️",
    "Terraforming Mars": "🚀",
    "SETI": "👽",
    "Clank!": "🎯",
    "Dominion": "👑",
    "Anachrony": "⏳",
    "Ark Nova": "🦁",
    "Azul": "🎨",
    "Ausonia": "🎨",
    "Gaia Project": "🌌",
    "Pax Pamir": "🚀",
    "Wingspan": "🐦",
    "Dune Imperium: Uprising": "🏜️",
    "Concordia": "🏛️",
    "Tuscany": "🍇"
  };

  const getGameIcon = (name: string) => {
    return gameIconMap[name] || "🎮";
  };

  const getCategoryBadgeStyle = (weight: string) => {
    const normalizedWeight = weight?.toLowerCase() || 'unknown';
    switch (normalizedWeight) {
      case "light": 
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "medium": 
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "heavy": 
        return "bg-red-100 text-red-700 border-red-200";
      default: 
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatLastPlayed = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleGameCardClick = (gameId: string, gameName: string) => {
    setSelectedGame({ id: gameId, name: gameName });
  };

  const handleCloseModal = () => {
    setSelectedGame(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Sorting Toggle Skeleton */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
          <div className="bg-gray-200 h-12 rounded-xl animate-pulse"></div>
        </div>
        
        {/* Card Skeletons */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
              <div className="flex-1">
                <div className="bg-gray-200 h-5 w-24 rounded mb-1"></div>
                <div className="bg-gray-200 h-4 w-16 rounded"></div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="bg-gray-200 h-10 rounded-lg"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading game dashboard</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Sorting Toggle */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setSortBy('plays')}
              className={`
                py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200
                ${sortBy === 'plays' 
                  ? 'bg-orange-100 text-orange-700 shadow-sm border border-orange-200' 
                  : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            Most Played
          </button>
          <button
            onClick={() => setSortBy('recent')}
            className={`
              py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200
              ${sortBy === 'recent' 
                ? 'bg-orange-100 text-orange-700 shadow-sm border border-orange-200' 
                : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            Last Played
          </button>
        </div>
      </div>

      {/* Game Cards */}
      {games.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎮</div>
          <p className="text-gray-600 text-lg">No games found</p>
          <p className="text-gray-500 text-sm">Start logging some game sessions!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {games.map((game, index) => {
            const isTopThree = sortBy === 'plays' && index < 3;
            const rankBadgeColors = ['bg-yellow-500', 'bg-gray-400', 'bg-amber-600'];
            
            return (
              <div
                key={game.game_id}
                onClick={() => handleGameCardClick(game.game_id, game.game_name)}
                className={`
                  relative bg-white rounded-xl border border-gray-200 shadow-sm p-3 
                  transition-all duration-200 hover:shadow-md hover:border-gray-300 cursor-pointer
                  active:scale-[0.98] hover:bg-gray-50
                  ${isTopThree ? 'ring-1 ring-blue-200 bg-blue-50/30' : ''}
                `}
              >
                {/* Top 3 Badge */}
                {isTopThree && (
                  <div className={`
                    absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center
                    ${rankBadgeColors[index]} text-white text-xs font-bold shadow-sm
                  `}>
                    {index + 1}
                  </div>
                )}

                {/* Game Header */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-base border border-gray-200">
                    {getGameIcon(game.game_name)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base text-gray-900 truncate mb-1">
                      {game.game_name}
                    </h3>
                    <Badge 
                      className={`
                          text-xs px-2 py-0.5 rounded-full font-medium border
                          ${getCategoryBadgeStyle(game.complexity)}
                        `}
                      >
                        {game.complexity || 'Unknown'}
                      </Badge>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 gap-1.5">
                    <div className="text-center bg-gray-50 rounded-lg p-2 border border-gray-100">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Gamepad2 className="h-3 w-3 text-blue-500" />
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {game.total_plays}
                      </div>
                      <div className="text-xs text-gray-500">Plays</div>
                    </div>

                    <div className="text-center bg-gray-50 rounded-lg p-2 border border-gray-100">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Trophy className="h-3 w-3 text-yellow-500" />
                      </div>
                      <div className="text-sm font-semibold text-yellow-600">
                        {game.win_rate || 0}%
                      </div>
                      <div className="text-xs text-gray-500">Win</div>
                    </div>

                    <div className="text-center bg-gray-50 rounded-lg p-2 border border-gray-100">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock className="h-3 w-3 text-green-500" />
                      </div>
                      <div className="text-sm font-semibold text-green-600">
                        {game.avg_duration || 0}m
                      </div>
                      <div className="text-xs text-gray-500">Time</div>
                    </div>

                    <div className="text-center bg-gray-50 rounded-lg p-2 border border-gray-100">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Calendar className="h-3 w-3 text-purple-500" />
                      </div>
                      <div className="text-sm font-semibold text-purple-600">
                        {formatLastPlayed(game.last_played)}
                      </div>
                      <div className="text-xs text-gray-500">Last</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Game Session History Modal */}
      <GameSessionHistoryModal
        isOpen={!!selectedGame}
        onClose={handleCloseModal}
        gameId={selectedGame?.id || null}
        gameName={selectedGame?.name || ''}
      />
    </>
  );
};

export default GamesDashboard;
