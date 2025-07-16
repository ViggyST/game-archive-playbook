
import { useState, useEffect } from "react";
import { useKiritoTrivia } from "@/hooks/useKiritoTrivia";
import { Card } from "@/components/ui/card";
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
      <div className="px-4 mb-6">
        <h3 className="font-poppins font-semibold text-navy mb-3">💡 Did You Know?</h3>
        <Card className="bg-violet-50 rounded-xl p-4 shadow-sm animate-pulse">
          <div className="h-4 bg-muted rounded"></div>
        </Card>
      </div>
    );
  }

  const nextFact = () => {
    setCurrentIndex((prev) => (prev + 1) % facts.length);
    setIsAutoPlaying(false);
  };

  const prevFact = () => {
    setCurrentIndex((prev) => (prev - 1 + facts.length) % facts.length);
    setIsAutoPlaying(false);
  };

  return (
    <div className="px-4 mb-6">
      <h3 className="font-poppins font-semibold text-navy mb-3">💡 Did You Know?</h3>
      <div className="relative">
        <Card className="bg-violet-50 rounded-xl p-4 shadow-sm border border-violet-100 animate-fade-slide-up">
          <div className="flex items-center justify-between">
            <button
              onClick={prevFact}
              className="p-1 rounded-full hover:bg-violet-100 transition-colors flex-shrink-0"
              disabled={facts.length <= 1}
            >
              <ChevronLeft className="h-4 w-4 text-violet-600" />
            </button>
            
            <div className="text-sm text-navy text-center mx-3 min-h-[20px] flex items-center justify-center">
              {facts[currentIndex]}
            </div>
            
            <button
              onClick={nextFact}
              className="p-1 rounded-full hover:bg-violet-100 transition-colors flex-shrink-0"
              disabled={facts.length <= 1}
            >
              <ChevronRight className="h-4 w-4 text-violet-600" />
            </button>
          </div>
          
          {facts.length > 1 && (
            <div className="flex justify-center mt-3 gap-1">
              {facts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-violet-400' : 'bg-violet-200'
                  }`}
                />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default KiritoTriviaCarousel;
