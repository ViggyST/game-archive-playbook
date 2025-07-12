
import { Gamepad2, Trophy, TrendingUp } from "lucide-react";

interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
}

interface PlayerStatsCardProps {
  stats: PlayerStats;
}

const PlayerStatsCard = ({ stats }: PlayerStatsCardProps) => {
  const statItems = [
    {
      icon: Gamepad2,
      value: stats.gamesPlayed,
      label: "Games Played",
      color: "text-sky-blue-600"
    },
    {
      icon: Trophy,
      value: stats.gamesWon,
      label: "Games Won",
      color: "text-meeple-gold-600"
    },
    {
      icon: TrendingUp,
      value: `${stats.winRate}%`,
      label: "Win Rate",
      color: "text-green-600"
    }
  ];

  return (
    <div className="px-6 py-4">
      <h2 className="font-poppins font-semibold text-navy text-lg mb-4">Your Stats</h2>
      <div className="grid grid-cols-3 gap-3">
        {statItems.map((item, index) => (
          <div 
            key={item.label}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex flex-col items-center text-center">
              <item.icon className={`h-6 w-6 mb-2 ${item.color}`} />
              <div className="font-poppins font-bold text-xl text-navy mb-1">
                {item.value}
              </div>
              <div className="font-inter text-xs text-gray-600 leading-tight">
                {item.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerStatsCard;
