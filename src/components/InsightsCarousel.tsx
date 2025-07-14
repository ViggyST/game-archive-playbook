
import { useState, useEffect } from "react";
import { Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";
import { usePlayerStats } from "@/hooks/usePlayerStats";
import { useMostPlayedGame } from "@/hooks/useMostPlayedGame";

interface InsightsCarouselProps {
  playerName: string;
}

const InsightsCarousel = ({ playerName }: InsightsCarouselProps) => {
  const [currentInsight, setCurrentInsight] = useState(0);
  const { data: playerStats } = usePlayerStats();
  const { data: mostPlayed } = useMostPlayedGame();

  // Generate dynamic insights based on real data
  const generateInsights = () => {
    const insights = [];
    
    if (playerStats) {
      if (playerStats.win_rate >= 70) {
        insights.push(`Amazing! You have a ${playerStats.win_rate}% win rate! 🏆`);
      } else if (playerStats.win_rate >= 50) {
        insights.push(`You're doing great with a ${playerStats.win_rate}% win rate! 📈`);
      }
      
      if (playerStats.games_played >= 20) {
        insights.push(`You're a gaming veteran with ${playerStats.games_played} games played! 🎮`);
      } else if (playerStats.games_played >= 10) {
        insights.push(`You've played ${playerStats.games_played} games so far! 🎯`);
      }
    }
    
    if (mostPlayed) {
      insights.push(`${mostPlayed.name} is your favorite with ${mostPlayed.times_played} plays! 🎲`);
    }

    // Add some general insights if we don't have enough dynamic ones
    if (insights.length < 3) {
      insights.push("Track more games to unlock personalized insights! 📊");
      insights.push("Every game tells a story worth remembering 📚");
      insights.push("Your board game journey is just getting started! 🚀");
    }

    return insights;
  };

  const insights = generateInsights();

  useEffect(() => {
    if (insights.length > 1) {
      const timer = setInterval(() => {
        setCurrentInsight((prev) => (prev + 1) % insights.length);
      }, 4000);

      return () => clearInterval(timer);
    }
  }, [insights.length]);

  const nextInsight = () => {
    setCurrentInsight((prev) => (prev + 1) % insights.length);
  };

  const prevInsight = () => {
    setCurrentInsight((prev) => (prev - 1 + insights.length) % insights.length);
  };

  if (insights.length === 0) return null;

  return (
    <div className="px-6 py-4">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 rounded-full p-2">
              <Lightbulb className="h-4 w-4 text-purple-600" />
            </div>
            <h3 className="font-poppins font-semibold text-gray-900">Did You Know?</h3>
          </div>
          
          {insights.length > 1 && (
            <div className="flex gap-1">
              <button
                onClick={prevInsight}
                className="p-1 rounded-full hover:bg-white/50 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={nextInsight}
                className="p-1 rounded-full hover:bg-white/50 transition-colors"
              >
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          )}
        </div>
        
        <div className="relative overflow-hidden h-8">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentInsight * 100}%)` }}
          >
            {insights.map((insight, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 font-inter text-sm text-gray-700"
              >
                {insight}
              </div>
            ))}
          </div>
        </div>
        
        {insights.length > 1 && (
          <div className="flex justify-center mt-4 gap-1">
            {insights.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentInsight(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentInsight ? 'bg-purple-400 w-4' : 'bg-purple-200'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsCarousel;
