
import { Trophy, Target, TrendingUp } from "lucide-react";

interface PlayerStatsCardProps {
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    winRate: number;
  };
}

const PlayerStatsCard = ({ stats }: PlayerStatsCardProps) => {
  return (
    <div className="px-6 py-4">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="bg-sky-blue-50 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <Target className="h-5 w-5 text-sky-blue-600" />
            </div>
            <div className="font-poppins font-bold text-lg text-gray-900">{stats.gamesPlayed}</div>
            <div className="font-inter text-xs text-gray-600">Games Played</div>
          </div>
          
          <div className="text-center">
            <div className="bg-meeple-gold-50 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <Trophy className="h-5 w-5 text-meeple-gold-600" />
            </div>
            <div className="font-poppins font-bold text-lg text-gray-900">{stats.gamesWon}</div>
            <div className="font-inter text-xs text-gray-600">Games Won</div>
          </div>
          
          <div className="text-center">
            <div className="bg-emerald-50 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="font-poppins font-bold text-lg text-gray-900">{stats.winRate}%</div>
            <div className="font-inter text-xs text-gray-600">Win Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStatsCard;
