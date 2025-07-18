
import { useKiritoGameInsights } from "@/hooks/useKiritoGameInsights";

const KiritoInsightCards = () => {
  const { data: insights, isLoading, error } = useKiritoGameInsights();

  if (isLoading || error || !insights) {
    return (
      <div className="px-4 mb-4 space-y-3 sm:px-6 sm:mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 sm:h-24 animate-pulse bg-muted rounded-2xl"></div>
        ))}
      </div>
    );
  }

  const insightCards = [
    {
      title: "Most Played",
      gameName: insights.mostPlayedGame.name,
      subtitle: `${insights.mostPlayedGame.count} sessions`,
      emoji: "💜",
      bgColor: "bg-purple-50",
      textColor: "text-purple-800",
      borderColor: "border-purple-200"
    },
    insights.bestWinRateGame && {
      title: "Best Win Rate",
      gameName: insights.bestWinRateGame.name,
      subtitle: `${insights.bestWinRateGame.winRate}% wins`,
      emoji: "💯",
      bgColor: "bg-green-50",
      textColor: "text-green-800",
      borderColor: "border-green-200"
    },
    insights.worstWinRateGame && {
      title: "Challenge Game",
      gameName: insights.worstWinRateGame.name,
      subtitle: `${insights.worstWinRateGame.winRate}% wins`,
      emoji: "⚡",
      bgColor: "bg-orange-50",
      textColor: "text-orange-800",
      borderColor: "border-orange-200"
    }
  ].filter(Boolean);

  return (
    <div className="px-4 mb-4 space-y-3 sm:px-6 sm:mb-6">
      {insightCards.map((card, index) => (
        <div 
          key={card.title}
          className={`${card.bgColor} ${card.borderColor} border rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-2xl sm:text-3xl flex-shrink-0">{card.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className={`text-xs sm:text-sm font-medium ${card.textColor} mb-1`}>
                {card.title}
              </div>
              <div className={`font-bold text-base sm:text-lg ${card.textColor} mb-1 truncate`}>
                {card.gameName}
              </div>
              <div className={`text-xs sm:text-sm ${card.textColor} opacity-75`}>
                {card.subtitle}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KiritoInsightCards;
