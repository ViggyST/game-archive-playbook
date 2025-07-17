
import { useKiritoGameInsights } from "@/hooks/useKiritoGameInsights";
import { Badge } from "@/components/ui/badge";

const KiritoInsightCards = () => {
  const { data: insights, isLoading, error } = useKiritoGameInsights();

  if (isLoading || error || !insights) {
    return (
      <div className="px-4 mb-2 flex flex-wrap justify-center gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 w-28 animate-pulse bg-muted rounded-full"></div>
        ))}
      </div>
    );
  }

  const insightBadges = [
    {
      title: insights.mostPlayedGame.name,
      label: "Most Played",
      emoji: "💜",
      bgColor: "bg-purple-50 hover:bg-purple-100",
      textColor: "text-purple-700",
      borderColor: "border-purple-200",
      secondaryText: `${insights.mostPlayedGame.count} games`
    },
    insights.bestWinRateGame && {
      title: insights.bestWinRateGame.name,
      label: "You Rock at",
      emoji: "💯",
      bgColor: "bg-green-50 hover:bg-green-100",
      textColor: "text-green-700",
      borderColor: "border-green-200",
      secondaryText: `${insights.bestWinRateGame.winRate}%`
    },
    insights.worstWinRateGame && {
      title: insights.worstWinRateGame.name,
      label: "You Suck at",
      emoji: "⚡",
      bgColor: "bg-orange-50 hover:bg-orange-100",
      textColor: "text-orange-700",
      borderColor: "border-orange-200",
      secondaryText: `${insights.worstWinRateGame.winRate}%`
    }
  ].filter(Boolean);

  return (
    <div className="px-4 mb-2">
      <div className="flex flex-wrap justify-center gap-2">
        {insightBadges.map((badge, index) => (
          <div 
            key={badge.label}
            className={`inline-flex items-center px-3 py-1 rounded-full shadow-sm ${badge.bgColor} ${badge.textColor} ${badge.borderColor} border animate-slide-up cursor-pointer`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <span className="mr-1">{badge.emoji}</span>
            <span className="font-medium text-xs mr-1">{badge.label}:</span>
            <span className="font-bold text-xs truncate max-w-32">{badge.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KiritoInsightCards;
