
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
    <div className="px-4 py-3 mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Track My Games Card */}
        <button
          onClick={handleTrackGames}
          className="bg-sky-500 hover:bg-sky-600 text-white rounded-2xl p-4 transition-all duration-200 hover:scale-105 animate-slide-up shadow-lg"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="flex items-center text-center space-x-3">
            <div className="bg-white/20 rounded-full p-2.5 flex-shrink-0">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-base">📊</span>
                <h3 className="font-poppins font-semibold text-base">
                  Track My Games
                </h3>
              </div>
              <p className="font-inter text-xs opacity-90">
                View analytics & insights
              </p>
            </div>
          </div>
        </button>

        {/* Log a Game Card */}
        <button
          onClick={handleLogGame}
          className="bg-orange-400 hover:bg-orange-500 text-white rounded-2xl p-4 transition-all duration-200 hover:scale-105 animate-slide-up shadow-lg"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="flex items-center text-center space-x-3">
            <div className="bg-white/20 rounded-full p-2.5 flex-shrink-0">
              <Target className="h-6 w-6" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-base">🎯</span>
                <h3 className="font-poppins font-semibold text-base">
                  Log a Game
                </h3>
              </div>
              <p className="font-inter text-xs opacity-90">
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
