
import { useState } from "react";
import { ArrowLeft, Calendar, Gamepad2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import CalendarView from "@/components/track-games/CalendarView";
import GamesView from "@/components/track-games/GamesView";
import PlayersView from "@/components/track-games/PlayersView";
import DynamicStatsCard from "@/components/track-games/DynamicStatsCard";

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

      {/* Dynamic Stats Card */}
      <div className="px-4 py-4">
        <DynamicStatsCard />
      </div>

      {/* Enhanced Tab Navigation */}
      <div className="px-4 py-2">
        <ToggleGroup 
          type="single" 
          value={activeTab} 
          onValueChange={(value) => value && setActiveTab(value)}
          className="grid grid-cols-3 gap-2 bg-gradient-to-r from-muted/60 to-muted/40 p-2 rounded-2xl shadow-lg backdrop-blur-sm"
        >
          <ToggleGroupItem 
            value="calendar"
            className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl font-poppins font-semibold text-sm transition-all duration-300 hover:scale-105 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-lg data-[state=on]:scale-105 data-[state=on]:border-2 data-[state=on]:border-sky-blue-500/20"
          >
            <Calendar className="h-5 w-5" />
            <span>Calendar</span>
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="games"
            className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl font-poppins font-semibold text-sm transition-all duration-300 hover:scale-105 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-lg data-[state=on]:scale-105 data-[state=on]:border-2 data-[state=on]:border-meeple-gold-500/20"
          >
            <Gamepad2 className="h-5 w-5" />
            <span>Games</span>
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="players"
            className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl font-poppins font-semibold text-sm transition-all duration-300 hover:scale-105 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-lg data-[state=on]:scale-105 data-[state=on]:border-2 data-[state=on]:border-emerald-500/20"
          >
            <Users className="h-5 w-5" />
            <span>Players</span>
          </ToggleGroupItem>
        </ToggleGroup>
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
