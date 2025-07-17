
import { useState, useEffect } from "react";
import { useKiritoTrivia } from "@/hooks/useKiritoTrivia";

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
        <h3 className="font-poppins font-semibold text-navy mb-2 text-center text-sm">💡 Did You Know?</h3>
        <div className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-2xl p-4 shadow-lg animate-pulse border border-violet-200">
          <div className="h-4 bg-violet-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 mb-4">
      <h3 className="font-poppins font-semibold text-navy mb-2 text-center text-sm">💡 Did You Know?</h3>
      <div className="relative">
        <div className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-2xl p-4 shadow-lg border-2 border-violet-200 animate-fade-slide-up backdrop-blur-sm">
          <div className="text-sm text-navy text-center min-h-[20px] flex items-center justify-center font-medium">
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
                      ? 'bg-violet-500 scale-125 shadow-lg' 
                      : 'bg-violet-300 hover:bg-violet-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KiritoTriviaCarousel;
