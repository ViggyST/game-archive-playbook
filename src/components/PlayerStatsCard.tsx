
import { Trophy, Target, TrendingUp } from "lucide-react";
import { usePlayerStats } from "@/hooks/usePlayerStats";

interface PlayerStatsCardProps {
  playerName: string;
}

const PlayerStatsCard = ({ playerName }: PlayerStatsCardProps) => {
  const { data: stats, isLoading, error } = usePlayerStats();

  if (isLoading) {
    return (
      <div className="px-6 py-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-pulse">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="bg-gray-200 rounded-full w-12 h-12 mx-auto mb-2"></div>
                <div className="bg-gray-200 h-4 rounded mb-1"></div>
                <div className="bg-gray-200 h-3 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="px-6 py-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
          <p className="text-red-600 text-center">Unable to load player stats</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="bg-sky-blue-50 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <Target className="h-5 w-5 text-sky-blue-600" />
            </div>
            <div className="font-poppins font-bold text-lg text-gray-900">{stats.games_played}</div>
            <div className="font-inter text-xs text-gray-600">Games Played</div>
          </div>
          
          <div className="text-center">
            <div className="bg-meeple-gold-50 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <Trophy className="h-5 w-5 text-meeple-gold-600" />
            </div>
            <div className="font-poppins font-bold text-lg text-gray-900">{stats.games_won}</div>
            <div className="font-inter text-xs text-gray-600">Games Won</div>
          </div>
          
          <div className="text-center">
            <div className="bg-emerald-50 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="font-poppins font-bold text-lg text-gray-900">{stats.win_rate}%</div>
            <div className="font-inter text-xs text-gray-600">Win Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStatsCard;
