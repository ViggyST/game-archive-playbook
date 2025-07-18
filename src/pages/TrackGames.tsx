
import { useState } from "react";
import { ArrowLeft, Calendar, Gamepad2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CalendarView from "@/components/track-games/CalendarView";
import GamesView from "@/components/track-games/GamesView";
import PlayersView from "@/components/track-games/PlayersView";

const TrackGames = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("calendar");

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      {/* Header - Mobile optimized */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-inter text-sm hidden sm:inline">Back</span>
          </button>
          <h1 className="font-poppins font-bold text-lg sm:text-xl text-gray-900">
            Track My Games
          </h1>
          <div className="w-12 sm:w-16" />
        </div>
      </div>

      {/* Tab Navigation - Mobile first design */}
      <div className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-1.5 sm:p-2">
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => setActiveTab("calendar")}
              className={`
                group flex flex-col items-center gap-1.5 sm:gap-2 py-3 sm:py-4 px-2 sm:px-3 rounded-xl font-medium text-xs sm:text-sm 
                transition-all duration-200 active:scale-95
                ${activeTab === "calendar" 
                  ? 'bg-orange-100 text-orange-700 shadow-sm border border-orange-200' 
                  : 'hover:bg-gray-50 text-gray-600 hover:text-gray-700'
                }
              `}
            >
              <Calendar className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-200 ${activeTab === "calendar" ? "scale-110" : "group-hover:scale-105"}`} />
              <span>Calendar</span>
            </button>
            
            <button
              onClick={() => setActiveTab("games")}
              className={`
                group flex flex-col items-center gap-1.5 sm:gap-2 py-3 sm:py-4 px-2 sm:px-3 rounded-xl font-medium text-xs sm:text-sm 
                transition-all duration-200 active:scale-95
                ${activeTab === "games" 
                  ? 'bg-orange-100 text-orange-700 shadow-sm border border-orange-200' 
                  : 'hover:bg-gray-50 text-gray-600 hover:text-gray-700'
                }
              `}
            >
              <Gamepad2 className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-200 ${activeTab === "games" ? "scale-110" : "group-hover:scale-105"}`} />
              <span>Games</span>
            </button>
            
            <button
              onClick={() => setActiveTab("players")}
              className={`
                group flex flex-col items-center gap-1.5 sm:gap-2 py-3 sm:py-4 px-2 sm:px-3 rounded-xl font-medium text-xs sm:text-sm 
                transition-all duration-200 active:scale-95
                ${activeTab === "players" 
                  ? 'bg-orange-100 text-orange-700 shadow-sm border border-orange-200' 
                  : 'hover:bg-gray-50 text-gray-600 hover:text-gray-700'
                }
              `}
            >
              <Users className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-200 ${activeTab === "players" ? "scale-110" : "group-hover:scale-105"}`} />
              <span>Players</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content - Mobile optimized */}
      <div className="px-4 pb-6 sm:px-6 sm:pb-8">
        {activeTab === "calendar" && <CalendarView />}
        {activeTab === "games" && <GamesView />}
        {activeTab === "players" && <PlayersView />}
      </div>
    </div>
  );
};

export default TrackGames;
