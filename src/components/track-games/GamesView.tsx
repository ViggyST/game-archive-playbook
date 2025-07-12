import { useState } from "react";
import { Trophy, Clock, TrendingUp, Users, BarChart3, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock games data
const mockGames = [
  {
    id: 1,
    name: "Terraforming Mars",
    category: "Heavy",
    coverImage: "🚀",
    totalPlays: 8,
    winRate: 62.5,
    avgDuration: 95,
    avgScore: 92,
    bestScore: 103,
    lastPlayed: "2024-12-09",
    topOpponents: ["Vishnu", "Shwetha"],
    recentScores: [95, 89, 78, 85, 92, 88, 103, 91]
  },
  {
    id: 2,
    name: "Azul",
    category: "Medium",
    coverImage: "🎨",
    totalPlays: 12,
    winRate: 33.3,
    avgDuration: 42,
    avgScore: 79,
    bestScore: 94,
    lastPlayed: "2024-12-05",
    topOpponents: ["Shwetha", "Vishnu"],
    recentScores: [82, 75, 68, 88, 79, 85, 72, 94]
  },
  {
    id: 3,
    name: "Jaipur",
    category: "Light",
    coverImage: "🏺",
    totalPlays: 15,
    winRate: 46.7,
    avgDuration: 22,
    avgScore: 108,
    bestScore: 125,
    lastPlayed: "2024-12-12",
    topOpponents: ["Shwetha"],
    recentScores: [104, 112, 98, 125, 115, 102, 109, 118]
  },
  {
    id: 4,
    name: "Wingspan",
    category: "Medium",
    coverImage: "🦅",
    totalPlays: 6,
    winRate: 66.7,
    avgDuration: 58,
    avgScore: 85,
    bestScore: 102,
    lastPlayed: "2024-12-14",
    topOpponents: ["Vishnu", "Shwetha"],
    recentScores: [88, 79, 92, 85, 102, 81]
  },
  {
    id: 5,
    name: "Codenames",
    category: "Light",
    coverImage: "🕵️",
    totalPlays: 10,
    winRate: 70.0,
    avgDuration: 28,
    avgScore: 0, // Team game, no scores
    bestScore: 0,
    lastPlayed: "2024-12-07",
    topOpponents: ["Vishnu", "Shwetha"],
    recentScores: []
  },
  {
    id: 6,
    name: "7 Wonders Duel",
    category: "Medium",
    coverImage: "🏛️",
    totalPlays: 4,
    winRate: 25.0,
    avgDuration: 38,
    avgScore: 76,
    bestScore: 81,
    lastPlayed: "2024-12-17",
    topOpponents: ["Shwetha"],
    recentScores: [81, 72, 74, 77]
  }
];

const GamesView = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Light": return "bg-emerald-500";
      case "Medium": return "bg-sky-blue-500";
      case "Heavy": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
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

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <Card className="bg-gradient-to-r from-meeple-gold-500/10 to-sky-blue-500/10 border-none shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-poppins font-bold text-foreground">
                {mockGames.length}
              </div>
              <div className="text-sm font-inter text-muted-foreground">Games Played</div>
            </div>
            <div>
              <div className="text-2xl font-poppins font-bold text-foreground">
                {Math.round(mockGames.reduce((sum, game) => sum + game.totalPlays, 0) / mockGames.length)}
              </div>
              <div className="text-sm font-inter text-muted-foreground">Avg Sessions</div>
            </div>
            <div>
              <div className="text-2xl font-poppins font-bold text-foreground">
                {Math.round(mockGames.reduce((sum, game) => sum + game.winRate, 0) / mockGames.length)}%
              </div>
              <div className="text-sm font-inter text-muted-foreground">Avg Win Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mockGames.map((game) => (
          <Card 
            key={game.id}
            className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-border/40 overflow-hidden"
            onClick={() => handleGameClick(game)}
          >
            <CardContent className="p-0">
              {/* Game Cover */}
              <div className="h-24 bg-gradient-to-br from-muted/30 to-muted/50 flex items-center justify-center relative">
                <div className="text-4xl">{game.coverImage}</div>
                <Badge 
                  variant={getCategoryBadgeVariant(game.category)}
                  className="absolute top-3 right-3"
                >
                  {game.category}
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
                      <div className="font-mono text-sm font-medium">{game.totalPlays}</div>
                      <div className="text-xs text-muted-foreground">Plays</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-meeple-gold-500" />
                    <div>
                      <div className="font-mono text-sm font-medium">{game.winRate}%</div>
                      <div className="text-xs text-muted-foreground">Win Rate</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-mono text-sm font-medium">{game.avgDuration}m</div>
                      <div className="text-xs text-muted-foreground">Avg Time</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-sky-blue-500" />
                    <div>
                      <div className="font-mono text-sm font-medium">{game.avgScore}</div>
                      <div className="text-xs text-muted-foreground">Avg Score</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      vs {game.topOpponents.slice(0, 2).join(", ")}
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
                  <div className="text-3xl">{selectedGame.coverImage}</div>
                  <div>
                    <DialogTitle className="font-poppins">{selectedGame.name}</DialogTitle>
                    <Badge variant={getCategoryBadgeVariant(selectedGame.category)}>
                      {selectedGame.category}
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
                          {selectedGame.totalPlays}
                        </div>
                        <div className="text-xs text-muted-foreground">Total Plays</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-poppins font-bold text-meeple-gold-500">
                          {selectedGame.winRate}%
                        </div>
                        <div className="text-xs text-muted-foreground">Win Rate</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-poppins font-semibold">
                          {selectedGame.avgScore > 0 ? selectedGame.avgScore : "N/A"}
                        </div>
                        <div className="text-xs text-muted-foreground">Avg Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-poppins font-semibold text-sky-blue-500">
                          {selectedGame.bestScore > 0 ? selectedGame.bestScore : "N/A"}
                        </div>
                        <div className="text-xs text-muted-foreground">Best Score</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Top Opponents */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-poppins">Top Opponents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedGame.topOpponents.map((opponent, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-sm">
                              {opponent.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-inter text-sm">{opponent}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Scores */}
                {selectedGame.recentScores.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-poppins">Recent Scores</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedGame.recentScores.slice(-8).map((score, idx) => (
                          <Badge key={idx} variant="outline" className="font-mono">
                            {score}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="text-center text-xs text-muted-foreground">
                  Last played: {new Date(selectedGame.lastPlayed).toLocaleDateString()}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GamesView;