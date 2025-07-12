
import { BarChart3, Dice6 } from "lucide-react";

const ActionCards = () => {
  const handleTrackGames = () => {
    console.log("Navigate to analytics/tracking section");
  };

  const handleLogGame = () => {
    console.log("Navigate to log game flow");
  };

  return (
    <div className="px-6 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Track My Games Card */}
        <button
          onClick={handleTrackGames}
          className="bg-sky-blue-500 hover:bg-sky-blue-600 text-white rounded-2xl p-6 transition-all duration-200 hover:scale-105 animate-slide-up shadow-lg"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="bg-white/20 rounded-full p-3">
              <BarChart3 className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-poppins font-semibold text-lg mb-1">
                Track My Games
              </h3>
              <p className="font-inter text-sm opacity-90">
                View analytics & insights
              </p>
            </div>
          </div>
        </button>

        {/* Log a Game Card */}
        <button
          onClick={handleLogGame}
          className="bg-meeple-gold-500 hover:bg-meeple-gold-600 text-white rounded-2xl p-6 transition-all duration-200 hover:scale-105 animate-slide-up shadow-lg"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="bg-white/20 rounded-full p-3">
              <Dice6 className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-poppins font-semibold text-lg mb-1">
                Log a Game
              </h3>
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
