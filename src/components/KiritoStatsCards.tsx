
import { Trophy, Gamepad2, TrendingUp } from "lucide-react";
import { useKiritoAllTimeStats } from "@/hooks/useKiritoAllTimeStats";
import { Card } from "@/components/ui/card";

const KiritoStatsCards = () => {
  const { data: stats, isLoading, error } = useKiritoAllTimeStats();

  if (isLoading || error || !stats) {
    return (
      <div className="grid grid-cols-3 gap-3 px-4 mb-2">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-2 animate-pulse">
            <div className="h-6 bg-muted rounded mb-2"></div>
            <div className="h-3 bg-muted rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      icon: <Gamepad2 className="h-4 w-4 text-blue-600" />,
      value: stats.gamesPlayed,
      label: "Games Played",
      emoji: "🎲"
    },
    {
      icon: <Trophy className="h-4 w-4 text-yellow-600" />,
      value: stats.gamesWon,
      label: "Games Won",
      emoji: "🏆"
    },
    {
      icon: <TrendingUp className="h-4 w-4 text-green-600" />,
      value: `${stats.winRate}%`,
      label: "Win Rate",
      emoji: "📈"
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-3 px-4 mb-2">
      {statCards.map((stat, index) => (
        <Card 
          key={stat.label}
          className="p-2 shadow-md hover:shadow-lg bg-gradient-to-br from-white to-gray-50 transition-all duration-200 hover:scale-[1.02] animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            <span className="text-lg">{stat.emoji}</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-navy text-center mb-0.5">
            {stat.value}
          </div>
          <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide text-center">
            {stat.label}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default KiritoStatsCards;
