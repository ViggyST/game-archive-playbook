
import { Trophy, Gamepad2, TrendingUp } from "lucide-react";
import { useKiritoAllTimeStats } from "@/hooks/useKiritoAllTimeStats";
import { Card } from "@/components/ui/card";

const KiritoStatsCards = () => {
  const { data: stats, isLoading, error } = useKiritoAllTimeStats();

  if (isLoading || error || !stats) {
    return (
      <div className="grid grid-cols-3 gap-3 px-4 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-8 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      icon: <Gamepad2 className="h-5 w-5 text-blue-600" />,
      value: stats.gamesPlayed,
      label: "Games Played",
      emoji: "🎲"
    },
    {
      icon: <Trophy className="h-5 w-5 text-yellow-600" />,
      value: stats.gamesWon,
      label: "Games Won",
      emoji: "🏆"
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-green-600" />,
      value: `${stats.winRate}%`,
      label: "Win Rate",
      emoji: "📈"
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-3 px-4 mb-6">
      {statCards.map((stat, index) => (
        <Card 
          key={stat.label}
          className="p-4 shadow-sm hover:scale-[1.02] transition-transform duration-200 animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{stat.emoji}</span>
            {stat.icon}
          </div>
          <div className="text-2xl font-bold text-navy mb-1">
            {stat.value}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            {stat.label}
          </div>
          <div className="text-xs text-muted-foreground opacity-60 mt-1">
            All Time
          </div>
        </Card>
      ))}
    </div>
  );
};

export default KiritoStatsCards;
