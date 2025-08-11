
import React, { useState, useMemo } from "react";
import { Plus, Users, X, Trophy, Crown, Minus, MessageSquare, Mic } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { GameData, Player } from "@/pages/LogGame";
import { evalStep2 } from "@/utils/validation";

interface CombinedPlayersScoresStepProps {
  gameData: GameData & { skipWinner?: boolean };
  updateGameData: (updates: Partial<GameData & { skipWinner?: boolean }>) => void;
  onNext?: () => void;
}

const AVATAR_COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
];

const CombinedPlayersScoresStep = ({ gameData, updateGameData }: CombinedPlayersScoresStepProps) => {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [maxScore, setMaxScore] = useState(500);
  const [showScoring, setShowScoring] = useState(gameData.players.length > 0);

  const validity = useMemo(() => evalStep2(gameData), [gameData]);
  const { hasAtLeastOnePlayer, allScoresFinite, hasWinner } = validity;

  const generateAvatar = (name: string, index: number) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length];
    return { initials, colorClass };
  };

  const baseValid = hasAtLeastOnePlayer && allScoresFinite;

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
    
    const updatedData: Partial<GameData & { skipWinner?: boolean }> = { 
      players: updatedPlayers, 
      scores: updatedScores,
      skipWinner: false // Clear skipWinner when removing players
    };
    
    if (gameData.winner === playerId) {
      updatedData.winner = undefined;
    }
    
    updateGameData(updatedData);

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
        [playerId]: Math.max(0, Math.min(maxScore, score))
      },
      skipWinner: false // Clear skipWinner when editing scores
    });
  };

  const adjustScore = (playerId: string, increment: number) => {
    const currentScore = gameData.scores[playerId] || 0;
    updateScore(playerId, currentScore + increment);
  };

  const toggleWinner = (playerId: string) => {
    updateGameData({
      winner: gameData.winner === playerId ? undefined : playerId,
      skipWinner: false // Clear skip flag if they choose a winner
    });
  };

  const adjustMaxScore = (newMax: number) => {
    setMaxScore(Math.max(100, newMax));
  };

  const handleVoiceInput = () => {
    console.log("Voice input would be implemented here");
  };


  return (
    <div className="px-5 py-3 animate-fade-in space-y-4">
      {/* Add Players Section */}
      {!showScoring && (
        <Card className="shadow-sm border-border/60 animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="font-inter text-lg font-semibold text-foreground flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                <Users className="h-3 w-3 text-white" />
              </div>
              Add Players
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
                  className="h-11 text-base border border-gray-200 rounded-lg focus:border-primary flex-1"
                />
                <Button 
                  onClick={addPlayer}
                  disabled={!newPlayerName.trim()}
                  size="icon"
                  className="h-11 w-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shrink-0 rounded-lg"
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
                
                <div className="space-y-2">
                  {gameData.players.map((player, index) => {
                    const { initials, colorClass } = generateAvatar(player.name, index);
                    
                    return (
                      <div 
                        key={player.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors h-12"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className={`${colorClass} text-white font-inter font-semibold text-xs`}>
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-inter font-medium text-gray-900 text-sm">
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
                  className="w-full h-11 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-inter rounded-lg"
                >
                  Confirm Players & Enter Scores
                </Button>
              </div>
            )}

            {/* Player Count Info */}
            <div className="text-center p-3 bg-sky-50 rounded-lg h-9 flex items-center justify-center">
              <p className="text-xs font-inter text-sky-700">
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
          <CardHeader className="pb-3">
            <CardTitle className="font-inter text-lg font-semibold text-foreground flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                <Trophy className="h-3 w-3 text-white" />
              </div>
              Enter Scores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Score Range Adjustment */}
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg h-8">
              <span className="font-inter text-xs text-gray-600">Score Range: 0 - {maxScore}</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustMaxScore(maxScore - 100)}
                  disabled={maxScore <= 100}
                  className="h-6 px-2 text-xs rounded-full border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100"
                >
                  -100
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustMaxScore(maxScore + 100)}
                  className="h-6 px-2 text-xs rounded-full border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100"
                >
                  +100
                </Button>
              </div>
            </div>

            {/* Players and Scores - Compact Layout */}
            <div className="space-y-2">
              {gameData.players.map((player, index) => {
                const { initials, colorClass } = generateAvatar(player.name, index);
                const score = gameData.scores[player.id] || 0;
                const isWinner = gameData.winner === player.id;
                
                return (
                  <div 
                    key={player.id}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      isWinner 
                        ? 'border-yellow-400 bg-yellow-50' 
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    {/* Row A: Player Info + Score */}
                    <div className="flex items-center justify-between mb-2 h-8">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className={`${colorClass} text-white font-inter font-semibold text-xs`}>
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-inter font-medium text-gray-900 text-sm">
                          {player.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleWinner(player.id)}
                          className={`h-7 px-2 text-xs rounded-full transition-all ${
                            isWinner 
                              ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900 border border-yellow-400' 
                              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Crown className="h-3 w-3 mr-1" />
                          {isWinner ? 'Winner' : 'Mark'}
                        </Button>
                      </div>
                      
                      <div className="text-lg font-bold text-gray-900">
                        {score}
                      </div>
                    </div>

                    {/* Row B: Score Controls */}
                    <div className="space-y-2">
                      {/* Slider */}
                      <Slider
                        value={[score]}
                        onValueChange={([value]) => updateScore(player.id, value)}
                        max={maxScore}
                        step={1}
                        className="w-full"
                      />
                      
                      {/* Compact Controls */}
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => adjustScore(player.id, -1)}
                          className="h-8 w-8 rounded-full border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 p-0"
                        >
                          -1
                        </Button>
                        <Input
                          type="number"
                          value={score}
                          onChange={(e) => updateScore(player.id, parseInt(e.target.value) || 0)}
                          className="w-14 text-center font-inter h-8 border-gray-200 rounded-lg text-sm"
                          min="0"
                          max={maxScore}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => adjustScore(player.id, 1)}
                          className="h-8 w-8 rounded-full border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 p-0"
                        >
                          +1
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Validation Info */}
            <div className="text-center p-2 bg-sky-50 rounded-lg h-8 flex items-center justify-center">
              <p className="text-xs font-inter text-sky-700">
                {!hasAtLeastOnePlayer 
                  ? "Add at least one player to continue"
                  : !allScoresFinite
                  ? "Enter a score for each player"
                  : baseValid && !hasWinner
                  ? "Don't forget to mark a winner."
                  : "Ready to proceed!"
                }
              </p>
            </div>

            {/* Back to Players Button */}
            <Button
              variant="outline"
              onClick={() => setShowScoring(false)}
              className="w-full h-11 border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 font-inter rounded-lg"
            >
              ← Back to Add Players
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Game Highlights Section - Always visible when in scoring mode */}
      {showScoring && gameData.players.length >= 1 && (
        <Card className="shadow-sm border-border/60 animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="font-inter text-lg font-semibold text-foreground flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <MessageSquare className="h-3 w-3 text-white" />
              </div>
              Game Highlights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
                  className="h-20 font-inter resize-none pr-10 border-gray-200 rounded-lg text-sm"
                  rows={3}
                />
                
                {/* Voice Input Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleVoiceInput}
                  className="absolute bottom-2 right-2 h-6 w-6 text-gray-400 hover:text-blue-500"
                  title="Voice input"
                >
                  <Mic className="h-3 w-3" />
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
          </CardContent>
        </Card>
      )}

    </div>
  );
};

// Export a wrapper that handles the confirm dialog logic
interface CombinedPlayersScoresStepWrapperProps {
  gameData: GameData & { skipWinner?: boolean };
  updateGameData: (updates: Partial<GameData & { skipWinner?: boolean }>) => void;
}

export default function CombinedPlayersScoresStepWrapper(props: CombinedPlayersScoresStepWrapperProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const validity = useMemo(() => evalStep2(props.gameData), [props.gameData]);
  const { hasAtLeastOnePlayer, allScoresFinite, hasWinner } = validity;
  
  const baseValid = hasAtLeastOnePlayer && allScoresFinite;

  const confirmProceedWithoutWinner = () => {
    props.updateGameData({ skipWinner: true });
    setConfirmOpen(false);
    // Trigger navigation after modal closes
    setTimeout(() => {
      const element = document.querySelector('[data-step-validation]');
      if (element && (element as any).proceedToNext) {
        (element as any).proceedToNext();
      }
    }, 0);
  };

  // Expose validation state to parent via data attributes for LogGame to read
  React.useEffect(() => {
    const element = document.querySelector('[data-step-validation]');
    if (element) {
      element.setAttribute('data-base-valid', String(baseValid));
      element.setAttribute('data-has-winner', String(hasWinner));
      element.setAttribute('data-can-proceed', String(validity.canProceed));
    }
  }, [baseValid, hasWinner, validity.canProceed]);

  // Handle next button click from parent
  const handleNextClick = React.useCallback(() => {
    if (!baseValid) return false; // Block navigation
    if (hasWinner) return true; // Allow navigation
    // Show modal for no winner
    setConfirmOpen(true);
    return false; // Block navigation until modal is resolved
  }, [baseValid, hasWinner]);

  // Function to proceed to next step (called after modal confirmation)
  const proceedToNext = React.useCallback(() => {
    const logGameElement = document.querySelector('[data-log-game]');
    if (logGameElement && (logGameElement as any).proceedToNextStep) {
      (logGameElement as any).proceedToNextStep();
    }
  }, []);

  // Expose handlers to parent
  React.useEffect(() => {
    const element = document.querySelector('[data-step-validation]');
    if (element) {
      (element as any).handleNextClick = handleNextClick;
      (element as any).proceedToNext = proceedToNext;
    }
  }, [handleNextClick, proceedToNext]);

  return (
    <>
      <div data-step-validation>
        <CombinedPlayersScoresStep 
          gameData={props.gameData}
          updateGameData={props.updateGameData}
        />
      </div>
      
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Proceed without a winner?</AlertDialogTitle>
            <AlertDialogDescription>
              You haven't marked a winner. You can still save the session without one.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmOpen(false)}>Go back</AlertDialogCancel>
            <AlertDialogAction onClick={confirmProceedWithoutWinner}>
              Yes, continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export { CombinedPlayersScoresStep };
