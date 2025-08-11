
import { useState } from "react";
import { Plus, Users, X, Trophy, Crown, Minus, MessageSquare, Mic } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { GameData, Player } from "@/pages/LogGame";

interface CombinedPlayersScoresStepProps {
  gameData: GameData;
  updateGameData: (updates: Partial<GameData>) => void;
}

const AVATAR_COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
];

const CombinedPlayersScoresStep = ({ gameData, updateGameData }: CombinedPlayersScoresStepProps) => {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [maxScore, setMaxScore] = useState(500);
  const [showScoring, setShowScoring] = useState(gameData.players.length > 0);

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

    // If no players left, go back to player adding mode
    if (updatedPlayers.length === 0) {
      setShowScoring(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addPlayer();
    }
  };

  const confirmPlayers = () => {
    if (gameData.players.length > 0) {
      setShowScoring(true);
    }
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

  const adjustMaxScore = (newMax: number) => {
    setMaxScore(Math.max(100, newMax));
  };

  const handleVoiceInput = () => {
    console.log("Voice input would be implemented here");
  };

  return (
    <div className="px-5 py-4 animate-fade-in space-y-6">
      {/* Add Players Section */}
      {!showScoring && (
        <Card className="shadow-sm border-border/60 animate-fade-in">
          <CardHeader className="pb-4">
            <CardTitle className="font-inter text-lg font-semibold text-foreground flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                <Users className="h-3 w-3 text-white" />
              </div>
              Add Players
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add New Player */}
            <div className="space-y-2">
              <Label htmlFor="playerName" className="font-inter text-sm font-medium text-gray-700">
                Player Name
              </Label>
              <div className="flex gap-3">
                <Input
                  id="playerName"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter player name..."
                  className="h-12 text-base border border-gray-200 rounded-lg focus:border-primary flex-1"
                />
                <Button 
                  onClick={addPlayer}
                  disabled={!newPlayerName.trim()}
                  size="icon"
                  className="h-12 w-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shrink-0 rounded-lg"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Players List */}
            {gameData.players.length > 0 && (
              <div className="space-y-3">
                <Label className="font-inter text-sm font-medium text-gray-700">
                  Players ({gameData.players.length})
                </Label>
                
                <div className="space-y-3">
                  {gameData.players.map((player, index) => {
                    const { initials, colorClass } = generateAvatar(player.name, index);
                    
                    return (
                      <div 
                        key={player.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className={`${colorClass} text-white font-inter font-semibold`}>
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-inter font-medium text-gray-900">
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

                {/* Confirm Players Button */}
                <Button
                  onClick={confirmPlayers}
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-inter rounded-lg"
                >
                  Confirm Players & Enter Scores
                </Button>
              </div>
            )}

            {/* Player Count Info */}
            <div className="text-center p-4 bg-sky-blue-50 rounded-lg">
              <p className="text-sm font-inter text-sky-blue-700">
                {gameData.players.length === 0 
                  ? "Add at least one player to continue" 
                  : `Ready! You have ${gameData.players.length} player${gameData.players.length > 1 ? 's' : ''} added.`
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enter Scores Section */}
      {showScoring && (
        <Card className="shadow-sm border-border/60 animate-fade-in">
          <CardHeader className="pb-4">
            <CardTitle className="font-inter text-lg font-semibold text-foreground flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                <Trophy className="h-3 w-3 text-white" />
              </div>
              Enter Scores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Max Score Adjustment */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-inter text-sm text-gray-900">Score Range: 0 - {maxScore}</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustMaxScore(maxScore - 100)}
                  disabled={maxScore <= 100}
                  className="h-8 px-3 rounded-full border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100"
                >
                  -100
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustMaxScore(maxScore + 100)}
                  className="h-8 px-3 rounded-full border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100"
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
                        ? 'border-yellow-400 bg-yellow-50 shadow-lg' 
                        : 'border-gray-200 bg-white hover:shadow-md'
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
                          <span className="font-inter font-medium text-gray-900">
                            {player.name}
                          </span>
                          {isWinner && (
                            <div className="flex items-center gap-1 text-orange-600">
                              <Crown className="h-3 w-3" />
                              <span className="text-xs font-inter font-medium">Winner</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Score Display */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {score}
                        </div>
                        <Button
                          variant={isWinner ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleWinner(player.id)}
                          className={`text-xs mt-1 h-8 px-3 rounded-full ${
                            isWinner 
                              ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white' 
                              : 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100'
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
                            className="h-8 w-8 rounded-full border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => adjustScore(player.id, -1)}
                            className="h-8 w-8 rounded-full border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100"
                          >
                            -1
                          </Button>
                        </div>
                        
                        <Input
                          type="number"
                          value={score}
                          onChange={(e) => updateScore(player.id, parseInt(e.target.value) || 0)}
                          className="w-20 text-center font-inter h-8 border-gray-200 rounded-lg"
                          min="0"
                          max={maxScore}
                        />
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => adjustScore(player.id, 1)}
                            className="h-8 w-8 rounded-full border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100"
                          >
                            +1
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => adjustScore(player.id, 10)}
                            className="h-8 w-8 rounded-full border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100"
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

            {/* Back to Players Button */}
            <Button
              variant="outline"
              onClick={() => setShowScoring(false)}
              className="w-full h-12 border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 font-inter rounded-lg"
            >
              ← Back to Add Players
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Game Highlights Section - Always visible when in scoring mode */}
      {showScoring && (
        <Card className="shadow-sm border-border/60 animate-fade-in">
          <CardHeader className="pb-4">
            <CardTitle className="font-inter text-lg font-semibold text-foreground flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <MessageSquare className="h-3 w-3 text-white" />
              </div>
              Game Highlights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Notes Input */}
            <div className="space-y-2">
              <Label htmlFor="highlights" className="font-inter text-sm font-medium text-gray-700">
                Notes & Memories (Optional)
              </Label>
              <div className="relative">
                <Textarea
                  id="highlights"
                  value={gameData.highlights}
                  onChange={(e) => updateGameData({ highlights: e.target.value })}
                  placeholder="Capture the moments that made this game session memorable!"
                  className="min-h-[120px] font-inter resize-none pr-12 border-gray-200 rounded-lg"
                  rows={5}
                />
                
                {/* Voice Input Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleVoiceInput}
                  className="absolute bottom-2 right-2 h-8 w-8 text-gray-400 hover:text-blue-500"
                  title="Voice input"
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Character Count */}
            {gameData.highlights && (
              <div className="text-right">
                <span className="text-xs text-gray-500 font-inter">
                  {gameData.highlights.length} characters
                </span>
              </div>
            )}

            {/* Skip Info */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-inter text-gray-600">
                You can always add highlights later or skip this step entirely.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CombinedPlayersScoresStep;
