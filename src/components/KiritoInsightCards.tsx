
import { useKiritoGameInsights } from "@/hooks/useKiritoGameInsights";
import { Card } from "@/components/ui/card";

const KiritoInsightCards = () => {
  const { data: insights, isLoading, error } = useKiritoGameInsights();

  if (isLoading || error || !insights) {
    return (
      <div className="px-4 mb-4 space-y-2">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-3 animate-pulse">
            <div className="h-4 bg-muted rounded mb-1"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </Card>
        ))}
      </div>
    );
  }

  const insightCards = [
    {
      title: insights.mostPlayedGame.name,
      label: "Most Played",
      emoji: "💜",
      bgColor: "bg-gradient-to-r from-purple-50 to-pink-50",
      borderColor: "border-purple-100",
      secondaryText: `${insights.mostPlayedGame.count} sessions`
    },
    insights.bestWinRateGame && {
      title: insights.bestWinRateGame.name,
      label: "Best Win Rate",
      emoji: "💯",
      bgColor: "bg-gradient-to-r from-green-50 to-emerald-50",
      borderColor: "border-green-100",
      secondaryText: `${insights.bestWinRateGame.winRate}% wins`
    },
    insights.worstWinRateGame && {
      title: insights.worstWinRateGame.name,
      label: "Challenge Game",
      emoji: "⚡",
      bgColor: "bg-gradient-to-r from-orange-50 to-red-50",
      borderColor: "border-orange-100",
      secondaryText: `${insights.worstWinRateGame.winRate}% wins`
    }
  ].filter(Boolean);

  return (
    <div className="px-4 mb-4 space-y-2">
      {insightCards.map((card, index) => (
        <Card 
          key={card.label}
          className={`p-3 shadow-sm ${card.bgColor} ${card.borderColor} border animate-slide-up`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center gap-2">
            <span className="text-base">{card.emoji}</span>
            <div className="flex-1">
              <div className="font-semibold text-navy text-xs mb-0.5">
                {card.label}
              </div>
              <div className="font-bold text-navy text-sm">
                {card.title}
              </div>
              {card.secondaryText && (
                <div className="text-xs text-muted-foreground">
                  {card.secondaryText}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default KiritoInsightCards;
