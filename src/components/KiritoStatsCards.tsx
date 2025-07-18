
import { Trophy, Gamepad2, TrendingUp } from "lucide-react";
import { useKiritoAllTimeStats } from "@/hooks/useKiritoAllTimeStats";

const KiritoStatsCards = () => {
  const { data: stats, isLoading, error } = useKiritoAllTimeStats();

  if (isLoading || error || !stats) {
    return (
      <div className="grid grid-cols-3 gap-2 px-4 mb-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse bg-muted rounded-2xl"></div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      icon: <Gamepad2 className="h-5 w-5 text-blue-600" />,
      value: stats.gamesPlayed,
      label: "Games Played",
      emoji: "🎯",
      gradient: "from-blue-50 to-blue-100",
      border: "border-blue-200"
    },
    {
      icon: <Trophy className="h-5 w-5 text-yellow-600" />,
      value: stats.gamesWon,
      label: "Games Won",
      emoji: "🏆",
      gradient: "from-yellow-50 to-yellow-100",
      border: "border-yellow-200"
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-green-600" />,
      value: `${stats.winRate}%`,
      label: "Win Rate",
      emoji: "📈",
      gradient: "from-green-50 to-green-100",
      border: "border-green-200"
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-2 px-4 mb-3">
      {statCards.map((stat, index) => (
        <div 
          key={stat.label}
          className={`relative p-3 rounded-2xl shadow-lg hover:shadow-xl bg-gradient-to-br ${stat.gradient} ${stat.border} border transition-all duration-300 hover:scale-[1.02] animate-fade-in group`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-sm"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-2">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{stat.emoji}</span>
            </div>
            <div className="text-2xl font-bold text-navy text-center mb-1">
              {stat.value}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide text-center font-medium">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KiritoStatsCards;
