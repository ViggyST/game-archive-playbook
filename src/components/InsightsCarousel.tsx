
import { useState, useEffect } from "react";
import { Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";

const InsightsCarousel = () => {
  const [currentInsight, setCurrentInsight] = useState(0);

  // Insights based on actual data from knowledge base
  const insights = [
    "Shwetha has never lost in Jaipur! 🏆",
    "You've played most games on weekends 📅",
    "Your longest session was 100min in Terraforming Mars ⏰",
    "Vishnu claimed all monasteries in Carcassonne 🏰",
    "Perfect team communication led to victory in The Crew 🚀",
    "Most games played at Home vs Cafe locations 🏠"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % insights.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [insights.length]);

  const nextInsight = () => {
    setCurrentInsight((prev) => (prev + 1) % insights.length);
  };

  const prevInsight = () => {
    setCurrentInsight((prev) => (prev - 1 + insights.length) % insights.length);
  };

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
      </div>
    </div>
  );
};

export default InsightsCarousel;
