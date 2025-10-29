import { format } from "date-fns";
import { Calendar, MapPin, Clock, Users, Trophy, MessageSquare, Tag, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { GameData } from "@/pages/LogGame";

interface ReviewSubmitStepProps {
  gameData: GameData;
  updateGameData: (updates: Partial<GameData>) => void;
}

const AVATAR_COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
];

const ReviewSubmitStep = ({ gameData }: ReviewSubmitStepProps) => {
  const generateAvatar = (name: string, index: number) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length];
    return { initials, colorClass };
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const complexityColors = {
    Light: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Heavy: 'bg-red-100 text-red-800'
  };

  const winnerPlayer = gameData.players.find(p => p.id === gameData.winner);
  const sortedPlayers = [...gameData.players].sort((a, b) => 
    (gameData.scores[b.id] || 0) - (gameData.scores[a.id] || 0)
  );

  return (
    <div className="space-y-6 animate-slide-up">
      <Card>
        <CardHeader>
          <CardTitle className="font-poppins text-xl text-navy flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[var(--brand)]" />
            Review & Submit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Game Info */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              {gameData.coverImage ? (
                <img 
                  src={gameData.coverImage} 
                  alt="Game cover" 
                  className="w-16 h-16 object-cover rounded-lg"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Tag className="h-6 w-6 text-gray-400" />
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="font-poppins font-bold text-lg text-navy">
                  {gameData.name}
                </h3>
                <Badge className={`${complexityColors[gameData.complexity]} font-inter text-xs`}>
                  {gameData.complexity}
                </Badge>
              </div>
            </div>
          </div>

          {/* Session Details */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3 text-sm font-inter">
              <Calendar className="h-4 w-4 text-sky-blue-500" />
              <span className="text-navy font-medium">
                {format(gameData.date, "EEEE, MMMM d, yyyy")}
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-sm font-inter">
              <MapPin className="h-4 w-4 text-sky-blue-500" />
              <span className="text-navy font-medium">{gameData.location}</span>
            </div>
            
            <div className="flex items-center gap-3 text-sm font-inter">
              <Clock className="h-4 w-4 text-sky-blue-500" />
              <span className="text-navy font-medium">
                {formatDuration(gameData.duration)}
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-sm font-inter">
              <Users className="h-4 w-4 text-sky-blue-500" />
              <span className="text-navy font-medium">
                {gameData.players.length} player{gameData.players.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Players & Scores */}
          <div className="space-y-3">
            <h4 className="font-inter font-semibold text-navy flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Final Scores
            </h4>
            
            <div className="space-y-2">
              {sortedPlayers.map((player, index) => {
                const { initials, colorClass } = generateAvatar(player.name, index);
                const score = gameData.scores[player.id] || 0;
                const isWinner = gameData.winner === player.id;
                const position = index + 1;
                
                return (
                  <div 
                    key={player.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      isWinner 
                        ? 'bg-[var(--brand)]/10 dark:bg-[var(--brand)]/20 border border-[var(--brand)]/20 dark:border-[var(--brand)]/30' 
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-inter font-bold text-gray-500 w-4">
                          {position}
                        </span>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={`${colorClass} text-white font-inter font-semibold text-xs`}>
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <div>
                        <span className="font-inter font-medium text-navy">
                          {player.name}
                        </span>
                        {isWinner && (
                          <div className="flex items-center gap-1 text-[var(--brand)]">
                            <Crown className="h-3 w-3" />
                            <span className="text-xs font-inter font-medium">Winner</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="font-poppins font-bold text-lg text-navy">
                        {score}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Highlights */}
          {gameData.highlights && (
            <div className="space-y-3">
              <h4 className="font-inter font-semibold text-navy flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Highlights
              </h4>
              <div className="p-3 bg-sky-blue-50 rounded-lg">
                <p className="text-sm font-inter text-navy whitespace-pre-wrap">
                  {gameData.highlights}
                </p>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="text-center p-4 bg-gradient-to-r from-sky-blue-50 to-[var(--brand)]/10 dark:from-sky-blue-900/20 dark:to-[var(--brand)]/20 rounded-lg border border-[var(--brand)]/20 dark:border-[var(--brand)]/30">
            <p className="font-inter text-sm text-navy dark:text-white">
              🎮 Ready to save this awesome game session? 
              {winnerPlayer && (
                <span className="block mt-1 font-medium">
                  Congratulations to {winnerPlayer.name} for the victory! 🏆
                </span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewSubmitStep;