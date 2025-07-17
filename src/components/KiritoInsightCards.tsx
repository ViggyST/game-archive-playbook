
import { useKiritoGameInsights } from "@/hooks/useKiritoGameInsights";

const KiritoInsightCards = () => {
  const { data: insights, isLoading, error } = useKiritoGameInsights();

  if (isLoading || error || !insights) {
    return (
      <div className="px-4 mb-3">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 w-40 animate-pulse bg-muted rounded-full flex-shrink-0"></div>
          ))}
        </div>
      </div>
    );
  }

  const insightBadges = [
    {
      title: insights.mostPlayedGame.name,
      label: "Most Played",
      emoji: "💜",
      bgColor: "bg-gradient-to-r from-purple-100 to-purple-200",
      textColor: "text-purple-800",
      borderColor: "border-purple-300",
      secondaryText: `${insights.mostPlayedGame.count} games`
    },
    insights.bestWinRateGame && {
      title: insights.bestWinRateGame.name,
      label: "You Rock At",
      emoji: "💯",
      bgColor: "bg-gradient-to-r from-emerald-100 to-emerald-200",
      textColor: "text-emerald-800",
      borderColor: "border-emerald-300",
      secondaryText: `${insights.bestWinRateGame.winRate}%`
    },
    insights.worstWinRateGame && {
      title: insights.worstWinRateGame.name,
      label: "You Suck At",
      emoji: "⚡",
      bgColor: "bg-gradient-to-r from-orange-100 to-red-200",
      textColor: "text-red-800",
      borderColor: "border-red-300",
      secondaryText: `${insights.worstWinRateGame.winRate}%`
    }
  ].filter(Boolean);

  return (
    <div className="px-4 mb-3">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {insightBadges.map((badge, index) => (
          <div 
            key={badge.label}
            className={`inline-flex items-center px-4 py-3 rounded-full shadow-md hover:shadow-lg ${badge.bgColor} ${badge.textColor} ${badge.borderColor} border-2 animate-scale-in cursor-pointer transition-all duration-300 hover:scale-105 flex-shrink-0 min-w-fit group`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <span className="mr-2 text-lg group-hover:scale-110 transition-transform">{badge.emoji}</span>
            <div className="text-center">
              <div className="font-bold text-sm">{badge.label}</div>
              <div className="font-semibold text-xs truncate max-w-24">{badge.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KiritoInsightCards;
