
import { useState, useEffect } from "react";
import { TrendingUp, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useGameInsights } from "@/hooks/useGameInsights";

const DynamicStatsCard = () => {
  const [currentInsight, setCurrentInsight] = useState(0);
  const { data: insights = [], isLoading } = useGameInsights();

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

  if (isLoading || insights.length === 0) {
    return (
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-none shadow-lg animate-pulse">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-purple-100 rounded-full p-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
              </div>
              <div className="bg-gray-200 h-5 w-32 rounded"></div>
            </div>
          </div>
          <div className="bg-gray-200 h-6 w-full rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 border-none shadow-xl transform hover:scale-102 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-full p-2 shadow-md">
              <Sparkles className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-poppins font-bold text-gray-900 text-lg">Did You Know?</h3>
          </div>
          
          {insights.length > 1 && (
            <div className="flex gap-1">
              <button
                onClick={prevInsight}
                className="p-2 rounded-full hover:bg-white/60 transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={nextInsight}
                className="p-2 rounded-full hover:bg-white/60 transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          )}
        </div>
        
        <div className="relative overflow-hidden h-12">
          <div 
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentInsight * 100}%)` }}
          >
            {insights.map((insight, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 flex items-center font-inter text-base text-gray-800 font-medium leading-relaxed"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-500 flex-shrink-0" />
                  <span>{insight}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {insights.length > 1 && (
          <div className="flex justify-center mt-4 gap-1.5">
            {insights.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentInsight(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentInsight ? 'bg-purple-400 w-6' : 'bg-purple-200 w-2'
                }`}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DynamicStatsCard;
