
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-inter text-sm">Back</span>
          </button>
          <h1 className="font-poppins font-bold text-xl text-gray-900">
            Track My Games
          </h1>
          <div className="w-16" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Tab Navigation - Clean Pill Style */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-2">
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => setActiveTab("calendar")}
              className={`
                group flex flex-col items-center gap-2 py-4 px-3 rounded-xl font-medium text-sm 
                transition-all duration-200
                ${activeTab === "calendar" 
                  ? 'bg-orange-100 text-orange-700 shadow-sm border border-orange-200' 
                  : 'hover:bg-gray-50 text-gray-600 hover:text-gray-700'
                }
              `}
            >
              <Calendar className={`h-5 w-5 transition-all duration-200 ${activeTab === "calendar" ? "scale-110" : "group-hover:scale-105"}`} />
              <span>Calendar</span>
            </button>
            
            <button
              onClick={() => setActiveTab("games")}
              className={`
                group flex flex-col items-center gap-2 py-4 px-3 rounded-xl font-medium text-sm 
                transition-all duration-200
                ${activeTab === "games" 
                  ? 'bg-orange-100 text-orange-700 shadow-sm border border-orange-200' 
                  : 'hover:bg-gray-50 text-gray-600 hover:text-gray-700'
                }
              `}
            >
              <Gamepad2 className={`h-5 w-5 transition-all duration-200 ${activeTab === "games" ? "scale-110" : "group-hover:scale-105"}`} />
              <span>Games</span>
            </button>
            
            <button
              onClick={() => setActiveTab("players")}
              className={`
                group flex flex-col items-center gap-2 py-4 px-3 rounded-xl font-medium text-sm 
                transition-all duration-200
                ${activeTab === "players" 
                  ? 'bg-orange-100 text-orange-700 shadow-sm border border-orange-200' 
                  : 'hover:bg-gray-50 text-gray-600 hover:text-gray-700'
                }
              `}
            >
              <Users className={`h-5 w-5 transition-all duration-200 ${activeTab === "players" ? "scale-110" : "group-hover:scale-105"}`} />
              <span>Players</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 pb-8">
        {activeTab === "calendar" && <CalendarView />}
        {activeTab === "games" && <GamesView />}
        {activeTab === "players" && <PlayersView />}
      </div>
    </div>
  );
};

export default TrackGames;
