
import { useState } from "react";
import { Trophy, Target, Users, Crown, Award, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { usePlayersWithKirito } from "@/hooks/usePlayersWithKirito";
import PlayerDetailModal from "./PlayerDetailModal";
import type { PlayerWithKiritoStats } from "@/hooks/usePlayersWithKirito";

const PlayersView = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerWithKiritoStats | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data, isLoading, error } = usePlayersWithKirito();
  const players = data?.players || [];
  const summary = data?.summary || { unique_players_count: 0, most_played_with: [] };

  const handlePlayerClick = (player: PlayerWithKiritoStats) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };

  const getPlayerColor = (index: number) => {
    const colors = ["bg-sky-blue-500", "bg-meeple-gold-500", "bg-emerald-500", "bg-purple-500", "bg-pink-500"];
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading Summary Bar */}
        <div className="bg-gradient-to-r from-muted/10 to-muted/20 rounded-2xl p-6 animate-pulse">
          <div className="flex gap-4">
            <div className="bg-gray-200 h-16 w-32 rounded-full"></div>
            <div className="bg-gray-200 h-16 flex-1 rounded-full"></div>
          </div>
        </div>
        
        {/* Loading Player Cards */}
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
        <p className="text-gray-600">No players found. Start logging some games with friends!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats Bar */}
      <div className="bg-gradient-to-r from-emerald-500/5 via-sky-blue-500/5 to-meeple-gold-500/5 rounded-2xl border border-border/20 shadow-lg backdrop-blur-sm p-6">
        <div className="flex flex-wrap gap-4">
          {/* Unique Players Count */}
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-full px-4 py-3 shadow-sm border border-border/20">
            <Users className="h-5 w-5 text-sky-blue-500" />
            <div>
              <div className="font-poppins font-bold text-lg text-foreground">
                {summary.unique_players_count}
              </div>
              <div className="text-xs font-medium text-muted-foreground">Players</div>
            </div>
          </div>

          {/* Most Played With */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-muted-foreground mb-2">Most Played With:</div>
            <div className="flex flex-wrap gap-2">
              {summary.most_played_with.map((player, index) => (
                <Badge 
                  key={player.name}
                  variant="outline" 
                  className="bg-white/60 backdrop-blur-sm border-border/30 text-foreground font-medium"
                >
                  {index === 0 && <Crown className="h-3 w-3 mr-1 text-meeple-gold-500" />}
                  {player.name} ({player.shared_sessions})
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Player Cards */}
      <div className="grid grid-cols-1 gap-4">
        {players.map((player, index) => (
          <div
            key={player.id}
            className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            onClick={() => handlePlayerClick(player)}
          >
            <div className="bg-gradient-to-br from-background/80 to-muted/20 backdrop-blur-xl rounded-2xl border border-border/30 overflow-hidden shadow-lg hover:shadow-xl hover:border-border/60 transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  {/* Left: Avatar + Name */}
                  <div className="flex items-center gap-4">
                    <Avatar className={`h-16 w-16 ${getPlayerColor(index)} text-white shadow-lg ring-2 ring-background/50 group-hover:ring-border/30 transition-all duration-300`}>
                      <AvatarFallback className="bg-transparent text-white font-poppins font-bold text-xl">
                        {player.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-poppins font-bold text-xl text-foreground group-hover:text-foreground/90 transition-colors">
                        {player.name}
                      </h3>
                      {index === 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <Crown className="h-4 w-4 text-meeple-gold-500" />
                          <span className="text-sm font-medium text-meeple-gold-500">Top Opponent</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Record */}
                  <div className="text-right">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Record</div>
                    <div className="font-mono text-lg font-bold text-foreground">
                      {player.record}
                    </div>
                  </div>
                </div>

                {/* Stats Chips */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-gradient-to-br from-sky-blue-500/10 to-sky-blue-500/20 rounded-xl hover:bg-sky-blue-500/30 transition-all duration-300 hover:scale-105 hover:shadow-md group/stat">
                    <Target className="h-5 w-5 text-sky-blue-500 mx-auto mb-2 group-hover/stat:scale-110 transition-transform duration-300" />
                    <div className="font-mono text-lg font-bold text-foreground group-hover/stat:text-sky-blue-500 transition-colors">
                      {player.games_played_with_kirito}
                    </div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Games</div>
                  </div>

                  <div className="text-center p-3 bg-gradient-to-br from-meeple-gold-500/10 to-meeple-gold-500/20 rounded-xl hover:bg-meeple-gold-500/30 transition-all duration-300 hover:scale-105 hover:shadow-md group/stat">
                    <Trophy className="h-5 w-5 text-meeple-gold-500 mx-auto mb-2 group-hover/stat:scale-110 transition-transform duration-300" />
                    <div className="font-mono text-lg font-bold text-foreground group-hover/stat:text-meeple-gold-500 transition-colors">
                      {player.win_rate_with_kirito}%
                    </div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Win Rate</div>
                  </div>

                  <div className="text-center p-3 bg-gradient-to-br from-emerald-500/10 to-emerald-500/20 rounded-xl hover:bg-emerald-500/30 transition-all duration-300 hover:scale-105 hover:shadow-md group/stat">
                    <Star className="h-5 w-5 text-emerald-500 mx-auto mb-2 group-hover/stat:scale-110 transition-transform duration-300" />
                    <div className="font-mono text-lg font-bold text-foreground group-hover/stat:text-emerald-500 transition-colors">
                      {player.wins_with_kirito}
                    </div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Wins</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Player Detail Modal */}
      <PlayerDetailModal
        player={selectedPlayer}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPlayer(null);
        }}
      />
    </div>
  );
};

export default PlayersView;
