
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
      icon: <Gamepad2 className="h-5 w-5" />,
      value: stats.gamesPlayed,
      label: "Games Played",
      emoji: "🎯"
    },
    {
      icon: <Trophy className="h-5 w-5" />,
      value: stats.gamesWon,
      label: "Games Won",
      emoji: "🏆"
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      value: `${stats.winRate}%`,
      label: "Win Rate",
      emoji: "📈"
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-2 px-4 mb-3">
      {statCards.map((stat, index) => (
        <div 
          key={stat.label}
          className="relative p-3 rounded-2xl shadow-sm hover:shadow-md bg-gradient-to-br from-[var(--brand)]/10 to-[var(--brand)]/20 dark:from-[var(--brand)]/10 dark:to-[var(--brand)]/15 border border-[var(--brand)]/20 dark:border-[var(--brand)]/30 transition-all duration-200 hover:scale-[1.02] animate-fade-in group"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-white/20 dark:bg-black/10 rounded-2xl backdrop-blur-sm"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-2">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{stat.emoji}</span>
            </div>
            <div className="text-2xl font-bold text-[var(--text-primary)] text-center mb-1">
              {stat.value}
            </div>
            <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wide text-center font-medium">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KiritoStatsCards;
