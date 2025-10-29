import { useState } from "react";
import { Trophy, Crown, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { GameData } from "@/pages/LogGame";

interface ScoreEntryStepProps {
  gameData: GameData;
  updateGameData: (updates: Partial<GameData>) => void;
}

const AVATAR_COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
];

const ScoreEntryStep = ({ gameData, updateGameData }: ScoreEntryStepProps) => {
  const [maxScore, setMaxScore] = useState(500);

  const generateAvatar = (name: string, index: number) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length];
    return { initials, colorClass };
  };

  const updateScore = (playerId: string, score: number) => {
    updateGameData({
      scores: {
        ...gameData.scores,
        [playerId]: Math.max(0, score)
      }
    });
  };

  const adjustScore = (playerId: string, increment: number) => {
    const currentScore = gameData.scores[playerId] || 0;
    updateScore(playerId, currentScore + increment);
  };

  const toggleWinner = (playerId: string) => {
    updateGameData({
      winner: gameData.winner === playerId ? undefined : playerId
    });
  };

  const getHighestScore = () => {
    const scores = Object.values(gameData.scores);
    return scores.length > 0 ? Math.max(...scores) : 0;
  };

  const adjustMaxScore = (newMax: number) => {
    setMaxScore(Math.max(100, newMax));
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <Card>
        <CardHeader>
          <CardTitle className="font-poppins text-xl text-navy flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[var(--brand)]" />
            Enter Scores
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Max Score Adjustment */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-inter text-sm text-navy">Score Range: 0 - {maxScore}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustMaxScore(maxScore - 100)}
                disabled={maxScore <= 100}
              >
                -100
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustMaxScore(maxScore + 100)}
              >
                +100
              </Button>
            </div>
          </div>

          {/* Players and Scores */}
          <div className="space-y-4">
            {gameData.players.map((player, index) => {
              const { initials, colorClass } = generateAvatar(player.name, index);
              const score = gameData.scores[player.id] || 0;
              const isWinner = gameData.winner === player.id;
              
              return (
                <div 
                  key={player.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isWinner 
                      ? 'border-[var(--brand)] bg-[var(--brand)]/10 dark:bg-[var(--brand)]/20 shadow-lg' 
                      : 'border-border bg-white hover:shadow-md'
                  }`}
                >
                  {/* Player Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className={`${colorClass} text-white font-inter font-semibold`}>
                          {initials}
                        </AvatarFallback>
                      </Avatar>
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
                    
                    {/* Score Display */}
                    <div className="text-right">
                      <div className="text-2xl font-poppins font-bold text-navy">
                        {score}
                      </div>
                      <Button
                        variant={isWinner ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleWinner(player.id)}
                        className={`text-xs mt-1 ${
                          isWinner 
                            ? 'bg-[var(--brand)] hover:bg-[var(--brand-hover)]' 
                            : 'hover:bg-[var(--brand)]/10 hover:text-[var(--brand)]'
                        }`}
                      >
                        {isWinner ? (
                          <>
                            <Crown className="h-3 w-3 mr-1" />
                            Winner
                          </>
                        ) : (
                          'Mark Winner'
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Score Controls */}
                  <div className="space-y-3">
                    {/* Slider */}
                    <Slider
                      value={[score]}
                      onValueChange={([value]) => updateScore(player.id, value)}
                      max={maxScore}
                      step={1}
                      className="w-full"
                    />
                    
                    {/* Manual Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => adjustScore(player.id, -10)}
                          className="h-8 w-8"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => adjustScore(player.id, -1)}
                          className="h-8 w-8"
                        >
                          -1
                        </Button>
                      </div>
                      
                      <Input
                        type="number"
                        value={score}
                        onChange={(e) => updateScore(player.id, parseInt(e.target.value) || 0)}
                        className="w-20 text-center font-inter"
                        min="0"
                        max={maxScore}
                      />
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => adjustScore(player.id, 1)}
                          className="h-8 w-8"
                        >
                          +1
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => adjustScore(player.id, 10)}
                          className="h-8 w-8"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Winner Info */}
          {!gameData.winner && gameData.players.length > 0 && (
            <div className="text-center p-4 bg-sky-blue-50 rounded-lg">
              <p className="text-sm font-inter text-sky-blue-700">
                Don't forget to mark the winner! 👑
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScoreEntryStep;