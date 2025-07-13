
import { Gamepad2 } from "lucide-react";
import { useMostPlayedGame } from "@/hooks/useMostPlayedGame";

const MostPlayedGameCard = () => {
  const { data: mostPlayed, isLoading, error } = useMostPlayedGame();

  if (isLoading || error || !mostPlayed) {
    return null;
  }

  return (
    <div className="px-6 py-2">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4 shadow-md border border-purple-100 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 rounded-full p-2">
            <Gamepad2 className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <div className="font-poppins font-semibold text-gray-900">Most Played</div>
            <div className="font-inter text-sm text-gray-700">
              {mostPlayed.name} ({mostPlayed.times_played} plays)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MostPlayedGameCard;
