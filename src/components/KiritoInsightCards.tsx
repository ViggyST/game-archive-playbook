
import { useKiritoGameInsights } from "@/hooks/useKiritoGameInsights";

const KiritoInsightCards = () => {
  const { data: insights, isLoading, error } = useKiritoGameInsights();

  if (isLoading || error || !insights) {
    return (
      <div className="px-4 mb-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse bg-muted rounded-2xl"></div>
        ))}
      </div>
    );
  }

  const insightCards = [
    {
      title: "Most Played",
      gameName: insights.mostPlayedGame.name,
      subtitle: `${insights.mostPlayedGame.count} sessions`,
      emoji: "💜"
    },
    insights.bestWinRateGame && {
      title: "Best Win Rate",
      gameName: insights.bestWinRateGame.name,
      subtitle: `${insights.bestWinRateGame.winRate}% wins`,
      emoji: "💯"
    },
    insights.worstWinRateGame && {
      title: "Worst Winrate",
      gameName: insights.worstWinRateGame.name,
      subtitle: `${insights.worstWinRateGame.winRate}% wins`,
      emoji: "⚡"
    }
  ].filter(Boolean);

  return (
    <div className="px-4 mb-4 space-y-3">
      {insightCards.map((card, index) => (
        <div 
          key={card.title}
          className="bg-[var(--brand)]/5 dark:bg-[var(--brand)]/10 border border-[var(--brand)]/20 dark:border-[var(--brand)]/30 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{card.emoji}</span>
            <div className="flex-1">
              <div className="text-sm font-medium text-[var(--text-secondary)] mb-1">
                {card.title}
              </div>
              <div className="font-bold text-lg text-[var(--text-primary)] mb-1">
                {card.gameName}
              </div>
              <div className="text-sm text-[var(--text-secondary)] opacity-75">
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
