
import { useState } from "react";
import { ArrowLeft, Calendar, Gamepad2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import CalendarView from "@/components/track-games/CalendarView";
import GamesView from "@/components/track-games/GamesView";
import PlayersView from "@/components/track-games/PlayersView";


const TrackGames = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("calendar");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/40">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-inter text-sm">Back</span>
          </button>
          <h1 className="font-poppins font-semibold text-xl text-foreground">
            Track My Games
          </h1>
          <div className="w-16" /> {/* Spacer for alignment */}
        </div>
      </div>


      {/* Enhanced Tab Navigation - More Visible Design */}
      <div className="px-4 py-6">
        <div className="bg-gradient-to-r from-background/90 to-muted/30 backdrop-blur-xl rounded-3xl border border-border/20 shadow-2xl overflow-hidden p-2">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActiveTab("calendar")}
              className={`
                group flex flex-col items-center gap-3 py-6 px-4 rounded-2xl font-poppins font-bold text-sm 
                transition-all duration-300 transform-gpu hover:scale-105 active:scale-95
                ${activeTab === "calendar" 
                  ? 'bg-gradient-to-br from-sky-blue-500 to-sky-blue-600 text-white shadow-xl shadow-sky-blue-500/30 scale-105 border-2 border-sky-blue-300/50' 
                  : 'hover:bg-muted/40 text-muted-foreground hover:text-foreground hover:shadow-lg'
                }
              `}
            >
              <Calendar className={`h-6 w-6 transition-all duration-300 ${activeTab === "calendar" ? "scale-110" : "group-hover:scale-110"}`} />
              <span className="tracking-wide">Calendar</span>
            </button>
            
            <button
              onClick={() => setActiveTab("games")}
              className={`
                group flex flex-col items-center gap-3 py-6 px-4 rounded-2xl font-poppins font-bold text-sm 
                transition-all duration-300 transform-gpu hover:scale-105 active:scale-95
                ${activeTab === "games" 
                  ? 'bg-gradient-to-br from-meeple-gold-500 to-meeple-gold-600 text-white shadow-xl shadow-meeple-gold-500/30 scale-105 border-2 border-meeple-gold-300/50' 
                  : 'hover:bg-muted/40 text-muted-foreground hover:text-foreground hover:shadow-lg'
                }
              `}
            >
              <Gamepad2 className={`h-6 w-6 transition-all duration-300 ${activeTab === "games" ? "scale-110" : "group-hover:scale-110"}`} />
              <span className="tracking-wide">Games</span>
            </button>
            
            <button
              onClick={() => setActiveTab("players")}
              className={`
                group flex flex-col items-center gap-3 py-6 px-4 rounded-2xl font-poppins font-bold text-sm 
                transition-all duration-300 transform-gpu hover:scale-105 active:scale-95
                ${activeTab === "players" 
                  ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xl shadow-emerald-500/30 scale-105 border-2 border-emerald-300/50' 
                  : 'hover:bg-muted/40 text-muted-foreground hover:text-foreground hover:shadow-lg'
                }
              `}
            >
              <Users className={`h-6 w-6 transition-all duration-300 ${activeTab === "players" ? "scale-110" : "group-hover:scale-110"}`} />
              <span className="tracking-wide">Players</span>
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
