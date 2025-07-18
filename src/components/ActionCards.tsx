
import { useNavigate } from "react-router-dom";
import { BarChart3, Target } from "lucide-react";

const ActionCards = () => {
  const navigate = useNavigate();
  
  const handleTrackGames = () => {
    navigate("/track-games");
  };

  const handleLogGame = () => {
    navigate("/log-game");
  };

  return (
    <div className="px-4 py-2 sm:px-6 sm:py-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {/* Track My Games Card - Mobile optimized */}
        <button
          onClick={handleTrackGames}
          className="bg-sky-500 hover:bg-sky-600 text-white rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:scale-105 hover:shadow-xl animate-slide-up shadow-lg min-h-[100px] sm:h-24 group active:scale-95"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 rounded-full p-2.5 sm:p-3 flex-shrink-0 group-hover:scale-110 transition-transform">
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="text-left sm:text-center flex-grow">
              <div className="flex items-center gap-1.5 mb-1 justify-start sm:justify-center">
                <span className="text-lg sm:text-lg">📊</span>
                <h3 className="font-poppins font-semibold text-lg sm:text-lg">
                  Track My Games
                </h3>
              </div>
              <p className="font-inter text-sm opacity-90">
                View analytics & insights
              </p>
            </div>
          </div>
        </button>

        {/* Log a Game Card - Mobile optimized */}
        <button
          onClick={handleLogGame}
          className="bg-orange-400 hover:bg-orange-500 text-white rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:scale-105 hover:shadow-xl animate-slide-up shadow-lg min-h-[100px] sm:h-24 group active:scale-95"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 rounded-full p-2.5 sm:p-3 flex-shrink-0 group-hover:scale-110 transition-transform">
              <Target className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="text-left sm:text-center flex-grow">
              <div className="flex items-center gap-1.5 mb-1 justify-start sm:justify-center">
                <span className="text-lg sm:text-lg">🎯</span>
                <h3 className="font-poppins font-semibold text-lg sm:text-lg">
                  Log a Game
                </h3>
              </div>
              <p className="font-inter text-sm opacity-90">
                Record a new session
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ActionCards;
