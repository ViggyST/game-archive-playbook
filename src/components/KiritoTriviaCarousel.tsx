
import { useState, useEffect } from "react";
import { useKiritoTrivia } from "@/hooks/useKiritoTrivia";
import { ChevronLeft, ChevronRight } from "lucide-react";

const KiritoTriviaCarousel = () => {
  const { data: facts, isLoading, error } = useKiritoTrivia();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!facts || facts.length === 0 || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % facts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [facts, isAutoPlaying]);

  if (isLoading || error || !facts || facts.length === 0) {
    return (
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-4 shadow-sm border border-violet-200">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">💡</span>
            <h3 className="font-poppins font-semibold text-violet-800 text-base">Did You Know?</h3>
          </div>
          <div className="h-4 bg-violet-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + facts.length) % facts.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % facts.length);
    setIsAutoPlaying(false);
  };

  return (
    <div className="px-4 mb-4">
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-4 shadow-sm border border-violet-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-xl">💡</span>
            <h3 className="font-poppins font-semibold text-violet-800 text-base">Did You Know?</h3>
          </div>
          
          {facts.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={goToPrevious}
                className="p-1 rounded-full hover:bg-violet-200 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-violet-600" />
              </button>
              <button
                onClick={goToNext}
                className="p-1 rounded-full hover:bg-violet-200 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-violet-600" />
              </button>
            </div>
          )}
        </div>

        <div className="text-sm text-violet-700 leading-relaxed min-h-[20px] flex items-center">
          {facts[currentIndex]}
        </div>
        
        {facts.length > 1 && (
          <div className="flex justify-center mt-3 gap-2">
            {facts.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlaying(false);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-violet-500 scale-125' 
                    : 'bg-violet-300 hover:bg-violet-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KiritoTriviaCarousel;
