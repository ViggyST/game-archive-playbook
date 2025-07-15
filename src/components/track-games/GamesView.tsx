
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
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-3xl border border-gray-100 shadow-sm animate-pulse">
            <div className="p-6">
              <div className="bg-gray-200 h-6 rounded mb-4"></div>
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="bg-gray-200 h-8 w-20 rounded-full"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
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
    <div className="space-y-4">
      {games.map((game) => {
        const hasWins = game.win_rate > 0;
        
        return (
          <div
            key={game.name}
            className="group cursor-pointer transition-all duration-200"
            onClick={() => handleGameClick(game)}
          >
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden p-6">
              {/* Game Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  {/* Game Icon/Emoji */}
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl">
                    {getGameEmoji(game.name)}
                  </div>
                  
                  {/* Game Name */}
                  <div className="flex flex-col">
                    <h3 className="font-bold text-2xl text-gray-900 mb-1">{game.name}</h3>
                    <Badge 
                      variant={getCategoryBadgeVariant(game.weight)}
                      className={`
                        text-xs px-3 py-1 rounded-full font-medium w-fit
                        ${game.weight === 'Light' ? 'bg-emerald-100 text-emerald-700' : ''}
                        ${game.weight === 'Medium' ? 'bg-blue-100 text-blue-700' : ''}
                        ${game.weight === 'Heavy' ? 'bg-red-100 text-red-700' : ''}
                      `}
                    >
                      {game.weight}
                    </Badge>
                  </div>
                </div>

                {/* Trophy for winners */}
                {hasWins && (
                  <div className="text-meeple-gold-500">
                    <Trophy className="h-8 w-8" />
                  </div>
                )}
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-gray-900">{game.plays}</div>
                  <div className="text-sm text-gray-500 font-medium">Plays</div>
                </div>
                
                <div>
                  <div className={`text-3xl font-bold ${hasWins ? 'text-meeple-gold-500' : 'text-gray-400'}`}>
                    {game.win_rate}%
                  </div>
                  <div className="text-sm text-gray-500 font-medium">Win Rate</div>
                </div>
                
                <div>
                  <div className="text-3xl font-bold text-sky-blue-500">{game.avg_duration}min</div>
                  <div className="text-sm text-gray-500 font-medium">Avg Time</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

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
