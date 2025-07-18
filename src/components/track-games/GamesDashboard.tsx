
import { useState } from "react";
import { Trophy, Clock, Gamepad2, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePlayerGameDashboard } from "@/hooks/usePlayerGameDashboard";

const GamesDashboard = () => {
  const [sortBy, setSortBy] = useState<'plays' | 'recent'>('plays');
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

  if (isLoading) {
    return (
      <div className="space-y-4 px-4">
        {/* Sorting Toggle Skeleton */}
        <div className="bg-gray-200 h-12 rounded-2xl animate-pulse"></div>
        
        {/* Card Skeletons */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-gray-800 rounded-2xl p-6 animate-pulse">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-700 rounded-xl"></div>
              <div className="flex-1">
                <div className="bg-gray-700 h-6 w-32 rounded mb-2"></div>
                <div className="bg-gray-700 h-4 w-16 rounded"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="bg-gray-700 h-12 rounded-xl"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 px-4">
        <p className="text-red-400">Error loading game dashboard</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 pb-8">
      {/* Sorting Toggle */}
      <div className="bg-gray-900 rounded-2xl p-2 border border-gray-800">
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => setSortBy('plays')}
            className={`
              py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200
              ${sortBy === 'plays' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
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
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
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
          <p className="text-gray-400 text-lg">No games found</p>
          <p className="text-gray-500 text-sm">Start logging some game sessions!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {games.map((game, index) => {
            const isTopThree = sortBy === 'plays' && index < 3;
            const rankBadgeColors = ['bg-yellow-500', 'bg-gray-400', 'bg-amber-600'];
            
            return (
              <div
                key={game.game_id}
                className={`
                  relative bg-gray-900 rounded-2xl p-6 border transition-all duration-300
                  hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-400/30
                  ${isTopThree ? 'border-blue-500/30 shadow-lg shadow-blue-500/5' : 'border-gray-800'}
                `}
                style={{
                  background: isTopThree 
                    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(17, 24, 39, 1))'
                    : undefined
                }}
              >
                {/* Top 3 Badge */}
                {isTopThree && (
                  <div className={`
                    absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center
                    ${rankBadgeColors[index]} text-white text-sm font-bold shadow-lg
                  `}>
                    {index + 1}
                  </div>
                )}

                {/* Game Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gray-800 rounded-xl flex items-center justify-center text-2xl border border-gray-700 transition-transform duration-200 hover:scale-110">
                    {getGameIcon(game.game_name)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xl text-white mb-2 truncate">
                      {game.game_name}
                    </h3>
                    <Badge 
                      className={`
                        text-xs px-3 py-1 rounded-full font-medium border
                        ${getCategoryBadgeStyle(game.complexity)}
                      `}
                    >
                      {game.complexity || 'Unknown'}
                    </Badge>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Gamepad2 className="h-4 w-4 text-blue-400" />
                      <span className="text-gray-400 text-sm">Plays</span>
                    </div>
                    <div className="text-xl font-bold text-white">
                      {game.total_plays}
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="h-4 w-4 text-yellow-400" />
                      <span className="text-gray-400 text-sm">Win Rate</span>
                    </div>
                    <div className="text-xl font-bold text-yellow-400">
                      {game.win_rate || 0}%
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-green-400" />
                      <span className="text-gray-400 text-sm">Avg Time</span>
                    </div>
                    <div className="text-xl font-bold text-green-400">
                      {game.avg_duration || 0}m
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-purple-400" />
                      <span className="text-gray-400 text-sm">Last Played</span>
                    </div>
                    <div className="text-lg font-bold text-purple-400">
                      {formatLastPlayed(game.last_played)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GamesDashboard;
