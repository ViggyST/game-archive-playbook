
import { useState } from "react";
import { Trophy, Clock, Gamepad2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useKiritoGameStats } from "@/hooks/useKiritoGameStats";

const GamesView = () => {
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
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex gap-3 overflow-x-auto pb-1">
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full whitespace-nowrap flex-shrink-0">
            <Gamepad2 className="h-4 w-4" />
            <span className="font-semibold">{summary.total_games} Games</span>
          </div>
          
          <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-full whitespace-nowrap flex-shrink-0">
            <Trophy className="h-4 w-4" />
            <span className="font-semibold">{summary.win_rate}% Win Rate</span>
          </div>
          
          {summary.light_games > 0 && (
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full whitespace-nowrap flex-shrink-0">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="font-medium">{summary.light_games} Light</span>
            </div>
          )}
          
          {summary.medium_games > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full whitespace-nowrap flex-shrink-0">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium">{summary.medium_games} Medium</span>
            </div>
          )}
          
          {summary.heavy_games > 0 && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full whitespace-nowrap flex-shrink-0">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="font-medium">{summary.heavy_games} Heavy</span>
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
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden p-6">
                  {/* Game Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {/* Game Icon with hover animation */}
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl transition-transform duration-200 group-hover:scale-110 group-hover:animate-bounce">
                        {getGameIcon(game.name)}
                      </div>
                      
                      {/* Game Name & Badge */}
                      <div className="flex flex-col">
                        <h3 className="font-bold text-2xl text-gray-900 mb-2">{game.name}</h3>
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

                    {/* Trophy for wins or perfect record badge */}
                    <div className="flex items-center gap-2">
                      {isPerfectRecord && game.plays > 1 && (
                        <div className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                          Perfect!
                        </div>
                      )}
                      {hasWins && (
                        <div className="text-meeple-gold-500 transition-transform duration-200 group-hover:scale-110">
                          <Trophy className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{game.plays}</div>
                      <div className="text-sm text-gray-500 font-medium">Plays</div>
                    </div>
                    
                    <div>
                      <div className={`text-2xl font-bold ${hasWins ? 'text-meeple-gold-500' : 'text-gray-400'}`}>
                        {Math.round(game.win_rate)}%
                      </div>
                      <div className="text-sm text-gray-500 font-medium">Win Rate</div>
                    </div>
                    
                    <div>
                      <div className="text-2xl font-bold text-sky-blue-500">{game.avg_duration}m</div>
                      <div className="text-sm text-gray-500 font-medium">Avg Time</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Complexity Legend */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
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
                        <div className="text-2xl font-poppins font-bold text-meeple-gold-500">
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
