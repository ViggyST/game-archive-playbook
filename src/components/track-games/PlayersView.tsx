
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
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)] p-6 mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Unique Players Count */}
          <div className="flex items-center gap-3 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-full px-5 py-3 shadow-sm">
            <Users className="h-5 w-5 text-[var(--brand)]" />
            <div>
              <div className="font-poppins font-bold text-xl text-[var(--text-primary)]">
                {summary.unique_players_count}
              </div>
              <div className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">Players</div>
            </div>
          </div>

          {/* Most Played With */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-[var(--text-secondary)] mb-3 uppercase tracking-wide">Most Played With:</div>
            <div className="flex flex-wrap gap-2">
              {summary.most_played_with.map((player, index) => (
                <Badge 
                  key={player.name}
                  variant="outline" 
                  className="bg-[var(--surface-elevated)] border-[var(--border)] text-[var(--text-primary)] font-medium px-3 py-1.5 shadow-sm"
                >
                  {index === 0 && <Crown className="h-3 w-3 mr-1.5 text-[var(--brand)]" />}
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
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)] hover:shadow-md hover:border-[var(--brand)]/20 transition-all duration-300">
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
                      <h3 className="font-poppins font-bold text-xl text-[var(--text-primary)] group-hover:text-[var(--text-primary)]/90 transition-colors">
                        {player.name}
                      </h3>
                      {index === 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <Crown className="h-4 w-4 text-[var(--brand)]" />
                          <span className="text-sm font-medium text-[var(--brand)]">Top Opponent</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Record */}
                  <div className="text-right">
                    <div className="text-sm font-medium text-[var(--text-secondary)] mb-1">Record</div>
                    <div className="font-mono text-lg font-bold text-[var(--text-primary)]">
                      {player.record}
                    </div>
                  </div>
                </div>

                {/* Stats Chips */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl p-3 text-center group/stat hover:border-[var(--brand)]/20 transition-colors">
                    <div className="font-mono text-lg font-bold text-[var(--text-primary)] group-hover/stat:text-[var(--brand)] transition-colors">
                      {player.games_played_with_kirito}
                    </div>
                    <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mt-1">Games</div>
                  </div>

                  <div className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl p-3 text-center group/stat hover:border-[var(--brand)]/20 transition-colors">
                    <div className="font-mono text-lg font-bold text-[var(--text-primary)] group-hover/stat:text-[var(--brand)] transition-colors">
                      {player.win_rate_with_kirito}%
                    </div>
                    <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mt-1">Win Rate</div>
                  </div>

                  <div className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl p-3 text-center group/stat hover:border-[var(--brand)]/20 transition-colors">
                    <div className="font-mono text-lg font-bold text-[var(--text-primary)] group-hover/stat:text-[var(--brand)] transition-colors">
                      {player.wins_with_kirito}
                    </div>
                    <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mt-1">Wins</div>
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
