import { useState } from "react";
import { Trophy, Clock, Gamepad2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useKiritoGameStats } from "@/hooks/useKiritoGameStats";
import { cn } from "@/lib/utils";
import GamesDashboard from "./GamesDashboard";

const GamesView = () => {
  // Check if we should show the new dashboard or the old Kirito-specific view
  const showNewDashboard = true; // We can make this configurable later
  
  if (showNewDashboard) {
    return <GamesDashboard />;
  }

  const [selectedGame, setSelectedGame] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data, isLoading, error } = useKiritoGameStats();
  const games = data?.games || [];
  const summary = data?.summary || { total_games: 0, win_rate: 0, light_games: 0, medium_games: 0, heavy_games: 0 };

  const getGameIcon = (name: string) => {
    const iconMap: Record<string, string> = {
      "Azul": "🟦",
      "Codenames": "🕵️‍♂️",
      "Terraforming Mars": "🚀",
      "Jaipur": "🐪", 
      "Wingspan": "🐦",
      "Marvel Remix": "🦸‍♂️",
      "Catan": "🏝️",
      "Ticket to Ride": "🚂",
      "Everdell": "🐿️",
      "On Mars": "🪐",
      "Clank!": "🎯",
      "Chess": "♟️",
      "Circle the wagon": "🛺",
      "Circle the Wagon": "🛺",
      "Splendor": "💎",
      "Pandemic": "🦠",
      "7 Wonders": "🏛️",
      "Scythe": "⚙️",
      "Gloomhaven": "🗡️",
      "Monopoly": "🏠",
      "Risk": "🌍",
      "Settlers of Catan": "🏝️",
      "Betrayal at House on the Hill": "🏚️",
      "Dominion": "👑",
      "King of Tokyo": "🦖",
      "Machi Koro": "🏙️",
      "Sushi Go!": "🍣",
      "Love Letter": "💌",
      "Exploding Kittens": "🐱",
      "Uno": "🎴",
      "Phase 10": "🔢",
      "Skip-Bo": "🎯",
      "Yahtzee": "🎲"
    };
    return iconMap[name] || "🎮";
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
        {/* Summary Strip Skeleton */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex gap-3 overflow-x-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 h-8 w-24 rounded-full animate-pulse flex-shrink-0"></div>
            ))}
          </div>
        </div>
        
        {/* Game Cards Skeleton */}
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading Kirito's game data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats Strip */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)] p-4 mb-6">
        <div className="flex gap-3 overflow-x-auto pb-1">
          <div className="flex items-center gap-2 bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] px-4 py-2.5 rounded-full whitespace-nowrap flex-shrink-0 shadow-sm">
            <Gamepad2 className="h-4 w-4 text-[var(--brand)]" />
            <span className="font-semibold text-sm">{summary.total_games} Games</span>
          </div>
          
          <div className="flex items-center gap-2 bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] px-4 py-2.5 rounded-full whitespace-nowrap flex-shrink-0 shadow-sm">
            <Trophy className="h-4 w-4 text-[var(--brand)]" />
            <span className="font-semibold text-sm">{summary.win_rate}% Win Rate</span>
          </div>
          
          {summary.light_games > 0 && (
            <div className="flex items-center gap-2 bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] px-4 py-2.5 rounded-full whitespace-nowrap flex-shrink-0 shadow-sm">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-green-500/20"></div>
              <span className="font-medium text-sm">{summary.light_games} Light</span>
            </div>
          )}
          
          {summary.medium_games > 0 && (
            <div className="flex items-center gap-2 bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] px-4 py-2.5 rounded-full whitespace-nowrap flex-shrink-0 shadow-sm">
              <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full ring-2 ring-yellow-500/20"></div>
              <span className="font-medium text-sm">{summary.medium_games} Medium</span>
            </div>
          )}
          
          {summary.heavy_games > 0 && (
            <div className="flex items-center gap-2 bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] px-4 py-2.5 rounded-full whitespace-nowrap flex-shrink-0 shadow-sm">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-red-500/20"></div>
              <span className="font-medium text-sm">{summary.heavy_games} Heavy</span>
            </div>
          )}
        </div>
      </div>

      {/* Game Cards */}
      {games.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No games found for Kirito. Start logging some games!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {games.map((game) => {
            const hasWins = game.win_rate > 0;
            const isPerfectRecord = game.win_rate === 100;
            
            return (
              <div
                key={game.name}
                className="group cursor-pointer transition-all duration-200"
                onClick={() => handleGameClick(game)}
              >
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)] hover:shadow-md hover:border-[var(--brand)]/20 transition-all duration-200 p-4 cursor-pointer group">
                  {/* Game Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {/* Game Icon with hover animation */}
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800/50 rounded-2xl flex items-center justify-center text-2xl transition-transform duration-200 group-hover:scale-110 border border-gray-200 dark:border-gray-700">
                        {getGameIcon(game.name)}
                      </div>
                      
                      {/* Game Name & Badge */}
                      <div className="flex flex-col">
                        <h3 className="font-bold text-2xl text-[var(--text-primary)] mb-2">{game.name}</h3>
                        <Badge 
                          variant={getCategoryBadgeVariant(game.weight)}
                          className={cn(
                            "text-xs px-3 py-1 rounded-full font-medium w-fit border",
                            game.weight === 'Light' && 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700/50',
                            game.weight === 'Medium' && 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700/50',
                            game.weight === 'Heavy' && 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700/50'
                          )}
                        >
                          {game.weight}
                        </Badge>
                      </div>
                    </div>

                    {/* Trophy for wins or perfect record badge */}
                    <div className="flex items-center gap-2">
                      {isPerfectRecord && game.plays > 1 && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                          Perfect!
                        </div>
                      )}
                      {hasWins && (
                        <div className="text-[var(--brand)] transition-transform duration-200 group-hover:scale-110">
                          <Trophy className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl p-3 text-center">
                      <div className="text-lg font-bold text-[var(--text-primary)]">{game.plays}</div>
                      <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">Plays</div>
                    </div>
                    
                    <div className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl p-3 text-center">
                      <div className={`text-lg font-bold ${hasWins ? 'text-[var(--brand)]' : 'text-[var(--text-secondary)]'}`}>
                        {Math.round(game.win_rate)}%
                      </div>
                      <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">Win Rate</div>
                    </div>
                    
                    <div className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl p-3 text-center">
                      <div className="text-lg font-bold text-[var(--text-primary)]">{game.avg_duration}m</div>
                      <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">Avg Time</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Complexity Legend */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm p-4">
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Complexity</h3>
          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Light</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Heavy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          {selectedGame && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{getGameIcon(selectedGame.name)}</div>
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
                    <CardTitle className="text-sm font-poppins">Kirito's Performance</CardTitle>
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
                        <div className="text-2xl font-poppins font-bold text-[var(--brand)]">
                          {Math.round(selectedGame.win_rate)}%
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
