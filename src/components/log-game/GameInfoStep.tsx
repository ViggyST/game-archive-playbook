import { useState } from "react";
import { Upload, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameData } from "@/pages/LogGame";

interface GameInfoStepProps {
  gameData: GameData;
  updateGameData: (updates: Partial<GameData>) => void;
}

const GAME_SUGGESTIONS = [
  "Wingspan", "Terraforming Mars", "Azul", "Ticket to Ride", "Splendor",
  "Catan", "7 Wonders", "Pandemic", "King of Tokyo", "Codenames"
];

const GameInfoStep = ({ gameData, updateGameData }: GameInfoStepProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(GAME_SUGGESTIONS);

  const handleNameChange = (value: string) => {
    updateGameData({ name: value });
    
    if (value.trim()) {
      const filtered = GAME_SUGGESTIONS.filter(game => 
        game.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (game: string) => {
    updateGameData({ name: game });
    setShowSuggestions(false);
  };

  const complexityColors = {
    Light: 'bg-green-100 text-green-800 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Heavy: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <Card>
        <CardHeader>
          <CardTitle className="font-poppins text-xl text-navy flex items-center gap-2">
            <Tag className="h-5 w-5 text-[var(--brand)]" />
            Game Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Game Name */}
          <div className="space-y-2">
            <Label htmlFor="gameName" className="font-inter font-medium text-navy">
              Game Name *
            </Label>
            <div className="relative">
              <Input
                id="gameName"
                value={gameData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Search or enter game name..."
                className="font-inter"
              />
              
              {/* Auto-suggestions */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredSuggestions.map((game) => (
                    <button
                      key={game}
                      onClick={() => selectSuggestion(game)}
                      className="w-full px-4 py-2 text-left hover:bg-sky-blue-50 font-inter text-sm transition-colors"
                    >
                      {game}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Game Complexity */}
          <div className="space-y-3">
            <Label className="font-inter font-medium text-navy">
              Game Complexity
            </Label>
            <div className="flex gap-3">
              {(['Light', 'Medium', 'Heavy'] as const).map((complexity) => (
                <button
                  key={complexity}
                  onClick={() => updateGameData({ complexity })}
                  className={`px-4 py-2 rounded-full border transition-all font-inter text-sm font-medium ${
                    gameData.complexity === complexity
                      ? complexityColors[complexity]
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {complexity}
                </button>
              ))}
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-3">
            <Label className="font-inter font-medium text-navy">
              Game Cover (Optional)
            </Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-sky-blue-300 transition-colors">
              {gameData.coverImage ? (
                <div className="space-y-2">
                  <img 
                    src={gameData.coverImage} 
                    alt="Game cover" 
                    className="w-24 h-24 object-cover rounded-lg mx-auto"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateGameData({ coverImage: undefined })}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground font-inter">
                    Tap to upload game cover
                  </p>
                  <Button variant="outline" size="sm">
                    Choose Photo
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameInfoStep;