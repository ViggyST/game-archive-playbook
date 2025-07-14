import { Trophy, Target, TrendingUp, Crown, Flame } from "lucide-react";
import { usePlayerStats } from "@/hooks/usePlayerStats";
import { useMostPlayedGame } from "@/hooks/useMostPlayedGame";

interface EnhancedPlayerStatsProps {
  playerName: string;
}

const EnhancedPlayerStats = ({ playerName }: EnhancedPlayerStatsProps) => {
  const { data: playerStats, isLoading, error } = usePlayerStats(playerName);
  const { data: mostPlayed } = useMostPlayedGame(playerName);

  if (isLoading) {
    return (
      <div className="px-6 py-4">
        <h2 className="font-poppins font-semibold text-xl text-navy mb-4">
          Hi {playerName} 👋
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 rounded-full flex-1 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded-full flex-1 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !playerStats) {
    return (
      <div className="px-6 py-4">
        <h2 className="font-poppins font-semibold text-xl text-navy mb-4">
          Hi {playerName} 👋
        </h2>
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <p className="text-gray-500">No game data found. Start logging games to see your stats!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4">
      {/* Section Title */}
      <h2 className="font-poppins font-semibold text-xl text-navy mb-4">
        Hi {playerName} 👋
      </h2>
      
      {/* Core Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-sky-blue-50 rounded-full p-2">
              <Target className="h-4 w-4 text-sky-blue-600" />
            </div>
          </div>
          <div className="font-poppins font-bold text-2xl text-navy">
            {playerStats.games_played}
          </div>
          <div className="font-inter text-xs text-gray-600">Games Played</div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-meeple-gold-50 rounded-full p-2">
              <Trophy className="h-4 w-4 text-meeple-gold-600" />
            </div>
          </div>
          <div className="font-poppins font-bold text-2xl text-navy">
            {playerStats.games_won}
          </div>
          <div className="font-inter text-xs text-gray-600">Games Won</div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-emerald-50 rounded-full p-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
          <div className="font-poppins font-bold text-2xl text-navy">
            {playerStats.win_rate}%
          </div>
          <div className="font-inter text-xs text-gray-600">Win Rate</div>
        </div>
      </div>

      {/* Dynamic Badges */}
      <div className="flex gap-2">
        {mostPlayed && (
          <div className="bg-gradient-to-r from-purple-100 to-purple-50 rounded-full px-4 py-2 flex items-center gap-2 flex-1 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Crown className="h-4 w-4 text-purple-600" />
            <div className="font-inter text-sm">
              <span className="text-gray-600">Most Played:</span>{" "}
              <span className="font-medium text-purple-700">{mostPlayed.name}</span>
            </div>
          </div>
        )}
        
        {playerStats.games_won >= 3 && (
          <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-full px-4 py-2 flex items-center gap-2 flex-1 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <Flame className="h-4 w-4 text-orange-600" />
            <div className="font-inter text-sm">
              <span className="text-gray-600">Best Streak:</span>{" "}
              <span className="font-medium text-orange-700">{Math.min(playerStats.games_won, 5)} wins</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedPlayerStats;