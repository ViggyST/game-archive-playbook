import { useState } from "react";
import { Plus, Users, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GameData, Player } from "@/pages/LogGame";

interface AddPlayersStepProps {
  gameData: GameData;
  updateGameData: (updates: Partial<GameData>) => void;
}

const AVATAR_COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
];

const AddPlayersStep = ({ gameData, updateGameData }: AddPlayersStepProps) => {
  const [newPlayerName, setNewPlayerName] = useState("");

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
    
    // Reset winner if removed player was winner
    const updatedData: Partial<GameData> = { 
      players: updatedPlayers, 
      scores: updatedScores 
    };
    
    if (gameData.winner === playerId) {
      updatedData.winner = undefined;
    }
    
    updateGameData(updatedData);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addPlayer();
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <Card>
        <CardHeader>
          <CardTitle className="font-poppins text-xl text-navy flex items-center gap-2">
            <Users className="h-5 w-5 text-meeple-gold-500" />
            Add Players
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Player */}
          <div className="space-y-2">
            <Label htmlFor="playerName" className="font-inter font-medium text-navy">
              Player Name
            </Label>
            <div className="flex gap-3">
              <Input
                id="playerName"
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
          </div>

          {/* Players List */}
          {gameData.players.length > 0 && (
            <div className="space-y-3">
              <Label className="font-inter font-medium text-navy">
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
    </div>
  );
};

export default AddPlayersStep;