
import { useState } from "react";
import { Trophy, Clock, TrendingUp, Users, BarChart3, ArrowRight, Target, Gamepad2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useGameStats } from "@/hooks/useGameStats";

const GamesView = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: games = [], isLoading, error } = useGameStats();

  const getCategoryColor = (weight: string) => {
    switch (weight) {
      case "Light": return "bg-emerald-500";
      case "Medium": return "bg-sky-blue-500";
      case "Heavy": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getCategoryBadgeVariant = (weight: string) => {
    switch (weight) {
      case "Light": return "default";
      case "Medium": return "secondary";
      case "Heavy": return "destructive";
      default: return "outline";
    }
  };

  const getGameEmoji = (name: string) => {
    // Simple mapping for common games
    const emojiMap: Record<string, string> = {
      "Azul": "🏺",
      "Codenames": "🕵️",
      "Terraforming Mars": "🚀",
      "Jaipur": "🐪", 
      "Wingspan": "🦅",
      "Marvel Remix": "🦸",
      "Catan": "🏝️",
      "Ticket to Ride": "🚂"
    };
    return emojiMap[name] || "🎲";
  };

  const handleGameClick = (game) => {
    setSelectedGame(game);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
          <div className="p-6">
            <div className="grid grid-cols-3 gap-6 text-center">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="bg-gray-200 h-8 rounded mb-2"></div>
                  <div className="bg-gray-200 h-5 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm animate-pulse">
              <div className="p-5">
                <div className="bg-gray-200 h-6 rounded mb-4"></div>
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="bg-gray-200 h-8 w-20 rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading games data</p>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No games found. Start logging some games!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats - Clean Card Style */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="flex justify-center">
                <Target className="h-8 w-8 text-sky-blue-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {games.length}
              </div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Games</div>
            </div>
            <div className="space-y-3 border-x border-gray-100">
              <div className="flex justify-center">
                <BarChart3 className="h-8 w-8 text-meeple-gold-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {Math.round(games.reduce((sum, game) => sum + game.plays, 0) / games.length)}
              </div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Avg Sessions</div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-center">
                <TrendingUp className="h-8 w-8 text-emerald-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {Math.round(games.reduce((sum, game) => sum + game.win_rate, 0) / games.length)}%
              </div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Win Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Games List - Card Style */}
      <div className="space-y-4">
        {games.map((game) => (
          <div
            key={game.name}
            className="group cursor-pointer transition-all duration-200 hover:scale-[1.02]"
            onClick={() => handleGameClick(game)}
          >
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
              <div className="p-5">
                {/* Game Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getGameEmoji(game.name)}</div>
                    <h3 className="font-bold text-xl text-gray-900">{game.name}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={getCategoryBadgeVariant(game.weight)}
                      className="font-medium"
                    >
                      {game.weight}
                    </Badge>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </div>

                {/* Stats Pills */}
                <div className="flex gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-2 bg-sky-blue-50 text-sky-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
                    <Gamepad2 className="h-4 w-4" />
                    <span>{game.plays} Plays</span>
                  </div>
                  
                  <div className="inline-flex items-center gap-2 bg-meeple-gold-50 text-meeple-gold-700 px-3 py-1.5 rounded-full text-sm font-medium">
                    <Trophy className="h-4 w-4" />
                    <span>{game.win_rate}% Win</span>
                  </div>
                  
                  <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-medium">
                    <Clock className="h-4 w-4" />
                    <span>{game.avg_duration}m</span>
                  </div>
                  
                  <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-sm font-medium">
                    <Target className="h-4 w-4" />
                    <span>{game.weight}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Game Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          {selectedGame && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{getGameEmoji(selectedGame.name)}</div>
                  <div>
                    <DialogTitle className="font-poppins">{selectedGame.name}</DialogTitle>
                    <Badge variant={getCategoryBadgeVariant(selectedGame.weight)}>
                      {selectedGame.weight}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Overall Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-poppins">Overall Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-poppins font-bold text-foreground">
                          {selectedGame.plays}
                        </div>
                        <div className="text-xs text-muted-foreground">Total Plays</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-poppins font-bold text-meeple-gold-500">
                          {selectedGame.win_rate}%
                        </div>
                        <div className="text-xs text-muted-foreground">Win Rate</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-poppins font-semibold">
                          {selectedGame.avg_duration}m
                        </div>
                        <div className="text-xs text-muted-foreground">Avg Duration</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-poppins font-semibold text-sky-blue-500">
                          {selectedGame.weight}
                        </div>
                        <div className="text-xs text-muted-foreground">Complexity</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GamesView;
