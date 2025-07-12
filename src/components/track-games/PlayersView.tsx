import { useState } from "react";
import { Trophy, Target, Clock, TrendingUp, Award, Star, Crown, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Mock players data
const mockPlayers = [
  {
    id: 1,
    name: "Vignesh",
    avatar: "V",
    color: "bg-sky-blue-500",
    gamesPlayed: 42,
    gamesWon: 28,
    winRate: 66.7,
    avgScore: 87,
    bestScore: 125,
    favoriteGame: "Terraforming Mars",
    lastPlayed: "2024-12-17",
    badges: [
      { name: "High Scorer", icon: "🎯", description: "Achieved score over 120" },
      { name: "Streak Master", icon: "🔥", description: "Won 5 games in a row" },
      { name: "Veteran", icon: "🏆", description: "Played 40+ games" }
    ],
    gameStats: [
      { game: "Terraforming Mars", plays: 8, wins: 5, winRate: 62.5 },
      { game: "Azul", plays: 12, wins: 4, winRate: 33.3 },
      { game: "Jaipur", plays: 15, wins: 7, winRate: 46.7 },
      { game: "Wingspan", plays: 6, wins: 4, winRate: 66.7 },
      { game: "Codenames", plays: 10, wins: 7, winRate: 70.0 }
    ],
    coPlayers: [
      { name: "Shwetha", gamesPlayed: 25 },
      { name: "Vishnu", gamesPlayed: 18 }
    ]
  },
  {
    id: 2,
    name: "Shwetha",
    avatar: "S",
    color: "bg-meeple-gold-500",
    gamesPlayed: 38,
    gamesWon: 22,
    winRate: 57.9,
    avgScore: 92,
    bestScore: 118,
    favoriteGame: "Jaipur",
    lastPlayed: "2024-12-17",
    badges: [
      { name: "Jaipur Queen", icon: "👑", description: "Undefeated in Jaipur" },
      { name: "Consistent", icon: "📊", description: "High average scores" },
      { name: "Social Gamer", icon: "👥", description: "Played with multiple opponents" }
    ],
    gameStats: [
      { game: "Jaipur", plays: 15, wins: 15, winRate: 100.0 },
      { game: "Azul", plays: 12, wins: 8, winRate: 66.7 },
      { game: "7 Wonders Duel", plays: 4, wins: 3, winRate: 75.0 },
      { game: "Terraforming Mars", plays: 5, wins: 2, winRate: 40.0 },
      { game: "Codenames", plays: 8, wins: 3, winRate: 37.5 }
    ],
    coPlayers: [
      { name: "Vignesh", gamesPlayed: 25 },
      { name: "Vishnu", gamesPlayed: 13 }
    ]
  },
  {
    id: 3,
    name: "Vishnu",
    avatar: "Vi",
    color: "bg-emerald-500",
    gamesPlayed: 28,
    gamesWon: 12,
    winRate: 42.9,
    avgScore: 81,
    bestScore: 98,
    favoriteGame: "Carcassonne",
    lastPlayed: "2024-12-14",
    badges: [
      { name: "Strategist", icon: "🧠", description: "Excellent in heavy games" },
      { name: "Team Player", icon: "🤝", description: "Great in cooperative games" }
    ],
    gameStats: [
      { game: "Carcassonne", plays: 3, wins: 2, winRate: 66.7 },
      { game: "Wingspan", plays: 6, wins: 2, winRate: 33.3 },
      { game: "Terraforming Mars", plays: 8, wins: 3, winRate: 37.5 },
      { game: "Azul", plays: 5, wins: 1, winRate: 20.0 },
      { game: "Codenames", plays: 10, wins: 6, winRate: 60.0 }
    ],
    coPlayers: [
      { name: "Vignesh", gamesPlayed: 18 },
      { name: "Shwetha", gamesPlayed: 13 }
    ]
  }
];

const PlayersView = () => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
    setIsDialogOpen(true);
  };

  const getPerformanceColor = (winRate: number) => {
    if (winRate >= 60) return "text-emerald-500";
    if (winRate >= 40) return "text-meeple-gold-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <Card className="bg-gradient-to-r from-meeple-gold-500/10 to-sky-blue-500/10 border-none shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-poppins font-bold text-foreground">
                {mockPlayers.length}
              </div>
              <div className="text-sm font-inter text-muted-foreground">Active Players</div>
            </div>
            <div>
              <div className="text-2xl font-poppins font-bold text-foreground">
                {Math.round(mockPlayers.reduce((sum, p) => sum + p.gamesPlayed, 0) / mockPlayers.length)}
              </div>
              <div className="text-sm font-inter text-muted-foreground">Avg Games</div>
            </div>
            <div>
              <div className="text-2xl font-poppins font-bold text-foreground">
                {Math.round(mockPlayers.reduce((sum, p) => sum + p.winRate, 0) / mockPlayers.length)}%
              </div>
              <div className="text-sm font-inter text-muted-foreground">Avg Win Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Players Grid */}
      <div className="grid grid-cols-1 gap-4">
        {mockPlayers.map((player) => (
          <Card 
            key={player.id}
            className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-border/40"
            onClick={() => handlePlayerClick(player)}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className={`h-16 w-16 ${player.color} text-white`}>
                    <AvatarFallback className="bg-transparent text-white font-poppins font-semibold text-lg">
                      {player.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {player.winRate >= 60 && (
                    <div className="absolute -top-1 -right-1 bg-meeple-gold-500 rounded-full p-1">
                      <Crown className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Player Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-poppins font-semibold text-xl">{player.name}</h3>
                    <div className="flex gap-1">
                      {player.badges.slice(0, 2).map((badge, idx) => (
                        <span key={idx} className="text-lg">{badge.icon}</span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="font-mono text-lg font-bold">{player.gamesPlayed}</div>
                      <div className="text-xs text-muted-foreground">Games</div>
                    </div>
                    <div>
                      <div className={`font-mono text-lg font-bold ${getPerformanceColor(player.winRate)}`}>
                        {player.winRate}%
                      </div>
                      <div className="text-xs text-muted-foreground">Win Rate</div>
                    </div>
                    <div>
                      <div className="font-mono text-lg font-bold">{player.avgScore}</div>
                      <div className="text-xs text-muted-foreground">Avg Score</div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Favorite: <span className="font-medium text-foreground">{player.favoriteGame}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last: {new Date(player.lastPlayed).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Player Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          {selectedPlayer && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <Avatar className={`h-12 w-12 ${selectedPlayer.color} text-white`}>
                    <AvatarFallback className="bg-transparent text-white font-poppins font-semibold">
                      {selectedPlayer.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="font-poppins">{selectedPlayer.name}</DialogTitle>
                    <div className="text-sm text-muted-foreground">
                      Player since {new Date(selectedPlayer.lastPlayed).getFullYear()}
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Overall Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-poppins">Performance Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-poppins font-bold text-foreground">
                          {selectedPlayer.gamesWon}/{selectedPlayer.gamesPlayed}
                        </div>
                        <div className="text-xs text-muted-foreground">Wins/Total</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-poppins font-bold ${getPerformanceColor(selectedPlayer.winRate)}`}>
                          {selectedPlayer.winRate}%
                        </div>
                        <div className="text-xs text-muted-foreground">Win Rate</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-poppins font-semibold">
                          {selectedPlayer.avgScore}
                        </div>
                        <div className="text-xs text-muted-foreground">Avg Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-poppins font-semibold text-sky-blue-500">
                          {selectedPlayer.bestScore}
                        </div>
                        <div className="text-xs text-muted-foreground">Best Score</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Badges */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-poppins">Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedPlayer.badges.map((badge, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                          <span className="text-2xl">{badge.icon}</span>
                          <div>
                            <div className="font-inter font-medium text-sm">{badge.name}</div>
                            <div className="text-xs text-muted-foreground">{badge.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Game Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-poppins">Game Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedPlayer.gameStats.map((stat, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div>
                            <div className="font-inter font-medium text-sm">{stat.game}</div>
                            <div className="text-xs text-muted-foreground">
                              {stat.wins}/{stat.plays} wins
                            </div>
                          </div>
                          <Badge 
                            variant={stat.winRate >= 60 ? "default" : stat.winRate >= 40 ? "secondary" : "destructive"}
                            className="font-mono"
                          >
                            {stat.winRate}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Co-Players */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-poppins">Frequent Opponents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedPlayer.coPlayers.map((coPlayer, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-sm">
                                {coPlayer.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-inter text-sm">{coPlayer.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {coPlayer.gamesPlayed} games
                          </span>
                        </div>
                      ))}
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

export default PlayersView;