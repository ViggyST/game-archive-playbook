import { useState, useEffect } from "react";
import { Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";
import { useGameInsights } from "@/hooks/useGameInsights";

interface EnhancedInsightsProps {
  playerName: string;
}

const EnhancedInsights = ({ playerName }: EnhancedInsightsProps) => {
  const [currentInsight, setCurrentInsight] = useState(0);
  const { data: insights } = useGameInsights();

  // Filter out generic insights and keep only data-driven ones
  const realInsights = insights?.filter(insight => 
    !insight.includes("Track more games") && 
    !insight.includes("Every game tells") && 
    !insight.includes("journey is just getting started")
  ) || [];

  useEffect(() => {
    if (realInsights.length > 1) {
      const timer = setInterval(() => {
        setCurrentInsight((prev) => (prev + 1) % realInsights.length);
      }, 4000);

      return () => clearInterval(timer);
    }
  }, [realInsights.length]);

  const nextInsight = () => {
    setCurrentInsight((prev) => (prev + 1) % realInsights.length);
  };

  const prevInsight = () => {
    setCurrentInsight((prev) => (prev - 1 + realInsights.length) % realInsights.length);
  };

  if (realInsights.length === 0) return null;

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
          
          {realInsights.length > 1 && (
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
        
        <div className="relative overflow-hidden min-h-[2rem]">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentInsight * 100}%)` }}
          >
            {realInsights.map((insight, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 font-inter text-sm text-gray-700 leading-relaxed"
              >
                {insight}
              </div>
            ))}
          </div>
        </div>
        
        {realInsights.length > 1 && (
          <div className="flex justify-center mt-4 gap-1">
            {realInsights.map((_, index) => (
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

export default EnhancedInsights;
