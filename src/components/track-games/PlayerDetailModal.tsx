
import { Trophy, Target, TrendingUp, Award, Crown, Skull } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePlayerGameStats } from "@/hooks/usePlayerGameStats";
import { PlayerWithKiritoStats } from "@/hooks/usePlayersWithKirito";

interface PlayerDetailModalProps {
  player: PlayerWithKiritoStats | null;
  isOpen: boolean;
  onClose: () => void;
}

const PlayerDetailModal = ({ player, isOpen, onClose }: PlayerDetailModalProps) => {
  const { data: gameStats = [], isLoading } = usePlayerGameStats(
    player?.id || '',
    isOpen && !!player
  );

  if (!player) return null;

  const getPlayerColor = () => {
    const colors = ["bg-sky-blue-500", "bg-meeple-gold-500", "bg-emerald-500", "bg-purple-500", "bg-pink-500"];
    return colors[0]; // Use first color for consistency
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <Avatar className={`h-20 w-20 ${getPlayerColor()} text-white shadow-lg`}>
              <AvatarFallback className="bg-transparent text-white font-poppins font-bold text-2xl">
                {player.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <DialogTitle className="font-poppins text-2xl">{player.name}</DialogTitle>
              <div className="text-sm text-muted-foreground">
                vs Kirito Stats
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-4 bg-gradient-to-br from-sky-blue-500/10 to-sky-blue-500/20 rounded-2xl">
              <Target className="h-6 w-6 text-sky-blue-500 mx-auto mb-2" />
              <div className="font-mono text-xl font-bold text-foreground">{player.games_played_with_kirito}</div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Games</div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-meeple-gold-500/10 to-meeple-gold-500/20 rounded-2xl">
              <Trophy className="h-6 w-6 text-meeple-gold-500 mx-auto mb-2" />
              <div className="font-mono text-xl font-bold text-foreground">{player.win_rate_with_kirito}%</div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Win Rate</div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-500/20 rounded-2xl">
              <Award className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
              <div className="font-mono text-xl font-bold text-foreground">{player.wins_with_kirito}</div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Wins</div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-red-500/10 to-red-500/20 rounded-2xl">
              <TrendingUp className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <div className="font-mono text-xl font-bold text-foreground">{player.losses_with_kirito}</div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Losses</div>
            </div>
          </div>

          {/* Game Performance */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-poppins font-semibold text-lg mb-4">Game Performance</h3>
              
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 h-16 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : gameStats.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No shared games found
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {gameStats.map((game, index) => (
                    <div
                      key={game.game_name}
                      className="p-4 bg-gradient-to-r from-muted/10 to-muted/20 rounded-xl border border-border/20"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🎲</span>
                          <div>
                            <h4 className="font-inter font-semibold text-sm">{game.game_name}</h4>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-xs text-muted-foreground">
                                Sessions: {game.sessions_played}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Wins: {game.wins}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-1">
                          <div className="font-mono text-lg font-bold text-foreground">
                            {game.win_rate}%
                          </div>
                          {game.is_highest_win_rate && (
                            <Badge variant="outline" className="text-xs bg-meeple-gold-500/10 text-meeple-gold-500 border-meeple-gold-500/20">
                              <Crown className="h-3 w-3 mr-1" />
                              Best
                            </Badge>
                          )}
                          {game.is_lowest_win_rate && (
                            <Badge variant="outline" className="text-xs bg-red-500/10 text-red-500 border-red-500/20">
                              <Skull className="h-3 w-3 mr-1" />
                              Worst
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Win Rate Bar */}
                      <div className="w-full bg-muted/30 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-meeple-gold-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${game.win_rate}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerDetailModal;
