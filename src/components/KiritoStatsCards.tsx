
import { Trophy, Gamepad2, TrendingUp } from "lucide-react";
import { useKiritoAllTimeStats } from "@/hooks/useKiritoAllTimeStats";

const KiritoStatsCards = () => {
  const { data: stats, isLoading, error } = useKiritoAllTimeStats();

  if (isLoading || error || !stats) {
    return (
      <div className="grid grid-cols-3 gap-2 px-4 mb-4 sm:gap-3 sm:px-6 sm:mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 sm:h-24 animate-pulse bg-muted rounded-2xl"></div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      icon: <Gamepad2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />,
      value: stats.gamesPlayed,
      label: "Games Played",
      emoji: "🎯",
      gradient: "from-blue-50 to-blue-100",
      border: "border-blue-200"
    },
    {
      icon: <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />,
      value: stats.gamesWon,
      label: "Games Won",
      emoji: "🏆",
      gradient: "from-yellow-50 to-yellow-100",
      border: "border-yellow-200"
    },
    {
      icon: <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />,
      value: `${stats.winRate}%`,
      label: "Win Rate",
      emoji: "📈",
      gradient: "from-green-50 to-green-100",
      border: "border-green-200"
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-2 px-4 mb-4 sm:gap-3 sm:px-6 sm:mb-6">
      {statCards.map((stat, index) => (
        <div 
          key={stat.label}
          className={`relative p-3 sm:p-4 rounded-2xl shadow-lg hover:shadow-xl bg-gradient-to-br ${stat.gradient} ${stat.border} border transition-all duration-300 hover:scale-[1.02] animate-fade-in group min-h-[80px] sm:min-h-[90px]`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-sm"></div>
          
          <div className="relative z-10 flex flex-col justify-center h-full">
            <div className="flex items-center justify-center mb-1 sm:mb-2">
              <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300">{stat.emoji}</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-navy text-center mb-0.5 sm:mb-1">
              {stat.value}
            </div>
            <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wide text-center font-medium leading-tight">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KiritoStatsCards;
