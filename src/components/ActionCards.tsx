
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
    <div className="px-4 py-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Track My Games Card */}
        <button
          onClick={handleTrackGames}
          className="bg-sky-500 hover:bg-sky-600 text-white rounded-2xl p-6 transition-all duration-200 hover:scale-105 animate-slide-up shadow-lg"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="bg-white/20 rounded-full p-3">
              <BarChart3 className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-lg">📊</span>
                <h3 className="font-poppins font-semibold text-lg">
                  Track My Games
                </h3>
              </div>
              <p className="font-inter text-sm opacity-90">
                View analytics & insights
              </p>
            </div>
          </div>
        </button>

        {/* Log a Game Card */}
        <button
          onClick={handleLogGame}
          className="bg-orange-400 hover:bg-orange-500 text-white rounded-2xl p-6 transition-all duration-200 hover:scale-105 animate-slide-up shadow-lg"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="bg-white/20 rounded-full p-3">
              <Target className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-lg">🎯</span>
                <h3 className="font-poppins font-semibold text-lg">
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
