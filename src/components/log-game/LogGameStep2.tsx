
import { useState } from "react";
import { Plus, X, Crown, Users, Trophy, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { GameData, Player } from "@/pages/LogGame";

interface LogGameStep2Props {
  gameData: GameData;
  updateGameData: (updates: Partial<GameData>) => void;
  onNext: () => void;
  canProceed: boolean;
}

const AVATAR_COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
];

const QUICK_HIGHLIGHTS = [
  "Great comeback",
  "Close match",
  "Everyone played well", 
  "Lots of laughs",
  "Perfect balance of luck"
];

const LogGameStep2 = ({ gameData, updateGameData, onNext, canProceed }: LogGameStep2Props) => {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [customHighlight, setCustomHighlight] = useState("");

  const generateAvatar = (name: string, index: number) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length];
    return { initials, colorClass };
  };

  const addPlayer = () => {
    if (newPlayerName.trim() && !gameData.players.find(p => p.name === newPlayerName.trim())) {
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: newPlayerName.trim(),
        avatar: `avatar-${Date.now()}`
      };
      
      updateGameData({ 
        players: [...gameData.players, newPlayer],
        scores: { ...gameData.scores, [newPlayer.id]: 0 }
      });
      setNewPlayerName("");
    }
  };

  const removePlayer = (playerId: string) => {
    const updatedPlayers = gameData.players.filter(p => p.id !== playerId);
    const updatedScores = { ...gameData.scores };
    delete updatedScores[playerId];
    
    const updatedData: Partial<GameData> = { 
      players: updatedPlayers, 
      scores: updatedScores 
    };
    
    if (gameData.winner === playerId) {
      updatedData.winner = undefined;
    }
    
    updateGameData(updatedData);
  };

  const updateScore = (playerId: string, score: number) => {
    updateGameData({
      scores: {
        ...gameData.scores,
        [playerId]: Math.max(0, score)
      }
    });
  };

  const toggleWinner = (playerId: string) => {
    updateGameData({
      winner: gameData.winner === playerId ? undefined : playerId
    });
  };

  const setQuickHighlight = (highlight: string) => {
    updateGameData({ highlights: highlight });
    setCustomHighlight("");
  };

  const handleCustomHighlightChange = (value: string) => {
    setCustomHighlight(value);
    updateGameData({ highlights: value });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addPlayer();
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Add Players */}
      <Card>
        <CardHeader>
          <CardTitle className="font-poppins text-xl text-navy flex items-center gap-2">
            <Users className="h-5 w-5 text-meeple-gold-500" />
            Add Players
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter player name..."
              className="font-inter flex-1"
            />
            <Button 
              onClick={addPlayer}
              disabled={!newPlayerName.trim()}
              size="icon"
              className="bg-meeple-gold-500 hover:bg-meeple-gold-600 text-white shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {gameData.players.length > 0 && (
            <div className="space-y-2">
              {gameData.players.map((player, index) => {
                const { initials, colorClass } = generateAvatar(player.name, index);
                
                return (
                  <div 
                    key={player.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={`${colorClass} text-white font-inter font-semibold text-xs`}>
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-inter font-medium text-navy">
                        {player.name}
                      </span>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePlayer(player.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enter Scores - Only show when >= 2 players */}
      {gameData.players.length >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-poppins text-xl text-navy flex items-center gap-2">
              <Trophy className="h-5 w-5 text-meeple-gold-500" />
              Enter Scores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {gameData.players.map((player, index) => {
              const { initials, colorClass } = generateAvatar(player.name, index);
              const score = gameData.scores[player.id] || 0;
              const isWinner = gameData.winner === player.id;
              
              return (
                <div 
                  key={player.id}
                  className={`p-3 rounded-lg border transition-all ${
                    isWinner 
                      ? 'border-meeple-gold-500 bg-meeple-gold-50' 
                      : 'border-border bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={`${colorClass} text-white font-inter font-semibold text-xs`}>
                          {initials}
                        </AvatarFallback>
                      </Avatar>
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
                    
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        value={score}
                        onChange={(e) => updateScore(player.id, parseInt(e.target.value) || 0)}
                        className="w-20 text-center font-inter"
                        min="0"
                      />
                      <Button
                        variant={isWinner ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleWinner(player.id)}
                        className={`${
                          isWinner 
                            ? 'bg-meeple-gold-500 hover:bg-meeple-gold-600' 
                            : 'hover:bg-meeple-gold-50 hover:text-meeple-gold-600'
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
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Strategy / Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="font-poppins text-xl text-navy flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-sky-blue-500" />
            Strategy / Memorable Moments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {QUICK_HIGHLIGHTS.map((highlight) => (
              <Button
                key={highlight}
                variant={gameData.highlights === highlight ? "default" : "outline"}
                size="sm"
                onClick={() => setQuickHighlight(highlight)}
                className="font-inter text-sm"
              >
                {highlight}
              </Button>
            ))}
          </div>
          
          <div>
            <Label className="font-inter text-sm text-navy">Or type your own:</Label>
            <Textarea
              value={customHighlight}
              onChange={(e) => handleCustomHighlightChange(e.target.value)}
              placeholder="Type your own if you like..."
              className="mt-2 font-inter"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Next Button */}
      <div className="sticky bottom-6">
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="w-full bg-gradient-to-r from-sky-blue-500 to-meeple-gold-500 text-white font-inter hover:opacity-90 h-12"
        >
          Next →
        </Button>
        {!canProceed && gameData.players.length >= 2 && (
          <p className="text-center text-sm text-red-500 mt-2 font-inter">
            Please enter scores for all players and mark a winner
          </p>
        )}
      </div>
    </div>
  );
};

export default LogGameStep2;
