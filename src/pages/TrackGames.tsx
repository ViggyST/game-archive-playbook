import { useState } from "react";
import { ArrowLeft, Calendar, Gamepad2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

      {/* Tab Navigation */}
      <div className="px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 backdrop-blur-sm">
            <TabsTrigger 
              value="calendar"
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Calendar</span>
            </TabsTrigger>
            <TabsTrigger 
              value="games"
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              <Gamepad2 className="h-4 w-4" />
              <span className="hidden sm:inline">Games</span>
            </TabsTrigger>
            <TabsTrigger 
              value="players"
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Players</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="calendar" className="mt-0">
              <CalendarView />
            </TabsContent>
            <TabsContent value="games" className="mt-0">
              <GamesView />
            </TabsContent>
            <TabsContent value="players" className="mt-0">
              <PlayersView />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default TrackGames;