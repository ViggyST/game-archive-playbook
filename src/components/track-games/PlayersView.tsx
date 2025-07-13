
import { useState } from "react";
import { Trophy, Target, Clock, TrendingUp, Award, Star, Crown, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { usePlayersList } from "@/hooks/usePlayersList";

const PlayersView = () => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: players = [], isLoading, error } = usePlayersList();

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
    setIsDialogOpen(true);
  };

  const getPerformanceColor = (winRate: number) => {
    if (winRate >= 60) return "text-emerald-500";
    if (winRate >= 40) return "text-meeple-gold-500";
    return "text-red-500";
  };

  const getPlayerColor = (index: number) => {
    const colors = ["bg-sky-blue-500", "bg-meeple-gold-500", "bg-emerald-500", "bg-purple-500", "bg-pink-500"];
    return colors[index % colors.length];
  };

  const generateBadges = (player) => {
    const badges = [];
    
    if (player.win_rate >= 70) {
      badges.push({ name: "High Performer", icon: "🏆", description: "70%+ win rate" });
    }
    
    if (player.games_played >= 20) {
      badges.push({ name: "Veteran", icon: "🎖️", description: "20+ games played" });
    } else if (player.games_played >= 10) {
      badges.push({ name: "Regular", icon: "🎯", description: "10+ games played" });
    }
    
    if (player.win_rate === 100) {
      badges.push({ name: "Undefeated", icon: "👑", description: "Perfect win record" });
    }
    
    return badges;
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
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-200 h-16 w-16 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="bg-gray-200 h-4 rounded"></div>
                    <div className="bg-gray-200 h-3 rounded w-2/3"></div>
                  </div>
                </div>
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
        <p className="text-red-600">Error loading players data</p>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No players found. Start logging some games!</p>
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
                {players.length}
              </div>
              <div className="text-sm font-inter text-muted-foreground">Active Players</div>
            </div>
            <div>
              <div className="text-2xl font-poppins font-bold text-foreground">
                {Math.round(players.reduce((sum, p) => sum + p.games_played, 0) / players.length)}
              </div>
              <div className="text-sm font-inter text-muted-foreground">Avg Games</div>
            </div>
            <div>
              <div className="text-2xl font-poppins font-bold text-foreground">
                {Math.round(players.reduce((sum, p) => sum + p.win_rate, 0) / players.length)}%
              </div>
              <div className="text-sm font-inter text-muted-foreground">Avg Win Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Players Grid */}
      <div className="grid grid-cols-1 gap-4">
        {players.map((player, index) => {
          const badges = generateBadges(player);
          
          return (
            <Card 
              key={player.name}
              className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-border/40"
              onClick={() => handlePlayerClick({...player, badges})}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className={`h-16 w-16 ${getPlayerColor(index)} text-white`}>
                      <AvatarFallback className="bg-transparent text-white font-poppins font-semibold text-lg">
                        {player.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {player.win_rate >= 60 && (
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
                        {badges.slice(0, 2).map((badge, idx) => (
                          <span key={idx} className="text-lg">{badge.icon}</span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="font-mono text-lg font-bold">{player.games_played}</div>
                        <div className="text-xs text-muted-foreground">Games</div>
                      </div>
                      <div>
                        <div className={`font-mono text-lg font-bold ${getPerformanceColor(player.win_rate)}`}>
                          {player.win_rate}%
                        </div>
                        <div className="text-xs text-muted-foreground">Win Rate</div>
                      </div>
                      <div>
                        <div className="font-mono text-lg font-bold">{player.games_won}</div>
                        <div className="text-xs text-muted-foreground">Wins</div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {player.games_won}/{player.games_played} games won
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Player Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          {selectedPlayer && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <Avatar className={`h-12 w-12 ${getPlayerColor(players.findIndex(p => p.name === selectedPlayer.name))} text-white`}>
                    <AvatarFallback className="bg-transparent text-white font-poppins font-semibold">
                      {selectedPlayer.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="font-poppins">{selectedPlayer.name}</DialogTitle>
                    <div className="text-sm text-muted-foreground">
                      Gaming Profile
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
                          {selectedPlayer.games_won}/{selectedPlayer.games_played}
                        </div>
                        <div className="text-xs text-muted-foreground">Wins/Total</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-poppins font-bold ${getPerformanceColor(selectedPlayer.win_rate)}`}>
                          {selectedPlayer.win_rate}%
                        </div>
                        <div className="text-xs text-muted-foreground">Win Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Badges */}
                {selectedPlayer.badges && selectedPlayer.badges.length > 0 && (
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
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlayersView;
