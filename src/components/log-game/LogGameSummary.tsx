
import { format } from "date-fns";
import { Calendar, MapPin, Clock, Trophy, Crown, MessageSquare, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GameData } from "@/pages/LogGame";

interface LogGameSummaryProps {
  gameData: GameData;
  onSubmit: () => void;
  canProceed: boolean;
  isPending: boolean;
}

const AVATAR_COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
];

const LogGameSummary = ({ gameData, onSubmit, canProceed, isPending }: LogGameSummaryProps) => {
  const generateAvatar = (name: string, index: number) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length];
    return { initials, colorClass };
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? mins + 'm' : ''}`;
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
      {/* Game Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="font-poppins text-xl text-navy flex items-center gap-2">
            <Trophy className="h-5 w-5 text-meeple-gold-500" />
            Game Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Game Info */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-poppins font-bold text-lg text-navy">
                {gameData.name}
              </h3>
              <Badge className={`${complexityColors[gameData.complexity]} font-inter text-xs mt-1`}>
                {gameData.complexity}
              </Badge>
            </div>
          </div>

          {/* Session Details */}
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center gap-2 font-inter">
              <Calendar className="h-4 w-4 text-sky-blue-500" />
              <span className="text-navy font-medium">
                {format(gameData.date, "EEEE, MMMM d, yyyy")}
              </span>
            </div>
            
            <div className="flex items-center gap-2 font-inter">
              <MapPin className="h-4 w-4 text-sky-blue-500" />
              <span className="text-navy font-medium">{gameData.location}</span>
            </div>
            
            <div className="flex items-center gap-2 font-inter">
              <Clock className="h-4 w-4 text-sky-blue-500" />
              <span className="text-navy font-medium">
                {formatDuration(gameData.duration)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Players & Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="font-poppins text-lg text-navy flex items-center gap-2">
            Final Scores
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                      ? 'bg-meeple-gold-50 border border-meeple-gold-200' 
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-inter font-bold text-gray-500 w-4">
                      {position}
                    </span>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={`${colorClass} text-white font-inter font-semibold text-xs`}>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <span className="font-inter font-medium text-navy">
                        {player.name}
                      </span>
                      {isWinner && (
                        <div className="flex items-center gap-1 text-meeple-gold-600">
                          <Crown className="h-3 w-3" />
                          <span className="text-xs font-inter font-medium">Winner</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <span className="font-poppins font-bold text-lg text-navy">
                    {score}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Highlights */}
      {gameData.highlights && (
        <Card>
          <CardHeader>
            <CardTitle className="font-poppins text-lg text-navy flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-inter text-navy">
              {gameData.highlights}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Feedback Message */}
      <div className="text-center p-4 bg-gradient-to-r from-sky-blue-50 to-meeple-gold-50 rounded-lg border">
        <p className="font-inter text-sm text-navy">
          🎮 Ready to save this awesome game session? 
          {winnerPlayer && (
            <span className="block mt-1 font-medium">
              Congratulations to {winnerPlayer.name} for the victory! 🏆
            </span>
          )}
        </p>
      </div>

      {/* Save Button */}
      <div className="sticky bottom-6">
        <Button
          onClick={onSubmit}
          disabled={!canProceed || isPending}
          className="w-full bg-gradient-to-r from-meeple-gold-500 to-sky-blue-500 text-white font-inter hover:opacity-90 h-12"
        >
          {isPending ? 'Saving...' : (
            <>
              Save Game
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default LogGameSummary;
