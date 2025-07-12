
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';

const InsightsCarousel = () => {
  const insights = [
    "You've never lost a game of Jaipur 🏆",
    "100% win rate against Shwetha in Terraforming Mars 🚀",
    "Most played game: Codenames (14 sessions) 🕵️",
    "You've played 7 different game genres this month 🎲",
    "Your longest winning streak was 5 games in a row 🔥"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % insights.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [insights.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + insights.length) % insights.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % insights.length);
  };

  return (
    <div className="px-6 py-4">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-5 w-5 text-meeple-gold-600" />
        <h2 className="font-poppins font-semibold text-navy text-lg">Did You Know?</h2>
      </div>
      
      <div className="relative bg-gradient-to-r from-sky-blue-50 to-meeple-gold-50 rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <button
            onClick={goToPrevious}
            className="p-2 rounded-full hover:bg-white/50 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-navy" />
          </button>
          
          <div className="flex-1 text-center px-4">
            <p 
              key={currentIndex}
              className="font-inter text-navy text-sm sm:text-base animate-fade-in"
            >
              {insights[currentIndex]}
            </p>
          </div>
          
          <button
            onClick={goToNext}
            className="p-2 rounded-full hover:bg-white/50 transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-navy" />
          </button>
        </div>
        
        {/* Dots indicator */}
        <div className="flex justify-center mt-4 gap-2">
          {insights.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-navy' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InsightsCarousel;
