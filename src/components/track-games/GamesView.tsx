
import { useState } from "react";
import { Trophy, Clock, TrendingUp, Users, BarChart3, ArrowRight } from "lucide-react";
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

  const handleGameClick = (game) => {
    setSelectedGame(game);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-meeple-gold-500/10 to-sky-blue-500/10 border-none shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="bg-gray-200 h-6 rounded mb-1"></div>
                  <div className="bg-gray-200 h-4 rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="bg-gray-200 h-24 rounded mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-3 rounded"></div>
              </CardContent>
            </Card>
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
      {/* Header Stats - Modern Style */}
      <div className="bg-gradient-to-r from-meeple-gold-500/5 via-sky-blue-500/5 to-emerald-500/5 rounded-3xl border border-border/20 shadow-xl backdrop-blur-sm overflow-hidden">
        <div className="p-8">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-poppins font-bold text-foreground">
                {games.length}
              </div>
              <div className="text-sm font-inter font-medium text-muted-foreground tracking-wide">Games</div>
            </div>
            <div className="space-y-2 border-x border-border/20">
              <div className="text-3xl font-poppins font-bold text-foreground">
                {Math.round(games.reduce((sum, game) => sum + game.plays, 0) / games.length)}
              </div>
              <div className="text-sm font-inter font-medium text-muted-foreground tracking-wide">Avg Sessions</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-poppins font-bold text-foreground">
                {Math.round(games.reduce((sum, game) => sum + game.win_rate, 0) / games.length)}%
              </div>
              <div className="text-sm font-inter font-medium text-muted-foreground tracking-wide">Win Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Games Grid - Premium Cards */}
      <div className="grid grid-cols-1 gap-6">
        {games.map((game) => (
          <div
            key={game.name}
            className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            onClick={() => handleGameClick(game)}
          >
            <div className="bg-gradient-to-br from-background/80 to-muted/20 backdrop-blur-xl rounded-3xl border border-border/30 overflow-hidden shadow-xl hover:shadow-2xl hover:border-border/60 transition-all duration-300">
              {/* Game Header - Enhanced with Icons */}
              <div className="relative h-24 bg-gradient-to-br from-muted/10 via-muted/20 to-muted/30 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-muted/5 to-muted/10" />
                <div className="relative z-10 flex items-center gap-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                    {game.weight === "Light" ? "🌟" : game.weight === "Heavy" ? "⚔️" : "🎯"}
                  </div>
                  <div className="text-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-300">🎲</div>
                </div>
                <Badge 
                  variant={getCategoryBadgeVariant(game.weight)}
                  className="absolute top-3 right-3 shadow-xl backdrop-blur-sm border border-background/20"
                >
                  {game.weight}
                </Badge>
              </div>

              {/* Game Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-poppins font-bold text-xl text-foreground group-hover:text-foreground/90 transition-colors">
                    {game.name}
                  </h3>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-200" />
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center p-4 bg-gradient-to-br from-muted/10 to-muted/30 rounded-2xl hover:bg-muted/40 transition-all duration-300 hover:scale-105 hover:shadow-lg group/stat">
                    <BarChart3 className="h-6 w-6 text-sky-blue-500 mx-auto mb-3 group-hover/stat:scale-110 transition-transform duration-300" />
                    <div className="font-mono text-xl font-bold text-foreground group-hover/stat:text-sky-blue-500 transition-colors">{game.plays}</div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Plays</div>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-br from-muted/10 to-muted/30 rounded-2xl hover:bg-muted/40 transition-all duration-300 hover:scale-105 hover:shadow-lg group/stat">
                    <Trophy className="h-6 w-6 text-meeple-gold-500 mx-auto mb-3 group-hover/stat:scale-110 transition-transform duration-300" />
                    <div className="font-mono text-xl font-bold text-foreground group-hover/stat:text-meeple-gold-500 transition-colors">{game.win_rate}%</div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Win</div>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-br from-muted/10 to-muted/30 rounded-2xl hover:bg-muted/40 transition-all duration-300 hover:scale-105 hover:shadow-lg group/stat">
                    <Clock className="h-6 w-6 text-emerald-500 mx-auto mb-3 group-hover/stat:scale-110 transition-transform duration-300" />
                    <div className="font-mono text-xl font-bold text-foreground group-hover/stat:text-emerald-500 transition-colors">{game.avg_duration}m</div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Time</div>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-br from-muted/10 to-muted/30 rounded-2xl hover:bg-muted/40 transition-all duration-300 hover:scale-105 hover:shadow-lg group/stat">
                    <TrendingUp className="h-6 w-6 text-purple-500 mx-auto mb-3 group-hover/stat:scale-110 transition-transform duration-300" />
                    <div className="font-mono text-sm font-bold text-foreground group-hover/stat:text-purple-500 transition-colors">{game.weight}</div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Level</div>
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
                  <div className="text-3xl">🎲</div>
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
