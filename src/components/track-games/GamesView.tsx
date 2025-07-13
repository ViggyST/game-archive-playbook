
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
      {/* Header Stats */}
      <Card className="bg-gradient-to-r from-meeple-gold-500/10 to-sky-blue-500/10 border-none shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-poppins font-bold text-foreground">
                {games.length}
              </div>
              <div className="text-sm font-inter text-muted-foreground">Games Played</div>
            </div>
            <div>
              <div className="text-2xl font-poppins font-bold text-foreground">
                {Math.round(games.reduce((sum, game) => sum + game.plays, 0) / games.length)}
              </div>
              <div className="text-sm font-inter text-muted-foreground">Avg Sessions</div>
            </div>
            <div>
              <div className="text-2xl font-poppins font-bold text-foreground">
                {Math.round(games.reduce((sum, game) => sum + game.win_rate, 0) / games.length)}%
              </div>
              <div className="text-sm font-inter text-muted-foreground">Avg Win Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {games.map((game) => (
          <Card 
            key={game.name}
            className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-border/40 overflow-hidden"
            onClick={() => handleGameClick(game)}
          >
            <CardContent className="p-0">
              {/* Game Cover */}
              <div className="h-24 bg-gradient-to-br from-muted/30 to-muted/50 flex items-center justify-center relative">
                <div className="text-4xl">🎲</div>
                <Badge 
                  variant={getCategoryBadgeVariant(game.weight)}
                  className="absolute top-3 right-3"
                >
                  {game.weight}
                </Badge>
              </div>

              {/* Game Info */}
              <div className="p-4">
                <h3 className="font-poppins font-semibold text-lg mb-2 truncate">
                  {game.name}
                </h3>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-mono text-sm font-medium">{game.plays}</div>
                      <div className="text-xs text-muted-foreground">Plays</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-meeple-gold-500" />
                    <div>
                      <div className="font-mono text-sm font-medium">{game.win_rate}%</div>
                      <div className="text-xs text-muted-foreground">Win Rate</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-mono text-sm font-medium">{game.avg_duration}m</div>
                      <div className="text-xs text-muted-foreground">Avg Time</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-sky-blue-500" />
                    <div>
                      <div className="font-mono text-sm font-medium">{game.weight}</div>
                      <div className="text-xs text-muted-foreground">Complexity</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {game.plays} session{game.plays !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
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
