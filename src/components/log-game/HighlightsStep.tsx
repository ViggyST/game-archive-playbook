import { Mic, MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameData } from "@/pages/LogGame";

interface HighlightsStepProps {
  gameData: GameData;
  updateGameData: (updates: Partial<GameData>) => void;
}

const HighlightsStep = ({ gameData, updateGameData }: HighlightsStepProps) => {
  const handleVoiceInput = () => {
    // Placeholder for voice-to-text functionality
    console.log("Voice input would be implemented here");
  };

  const quickHighlights = [
    "Amazing comeback victory!",
    "Close game until the end",
    "Great strategy by everyone",
    "Lots of laughs and fun",
    "Unexpected plot twists",
    "Perfect balance of luck and skill"
  ];

  const addQuickHighlight = (highlight: string) => {
    const currentText = gameData.highlights.trim();
    const newText = currentText 
      ? `${currentText}\n${highlight}` 
      : highlight;
    updateGameData({ highlights: newText });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <Card>
        <CardHeader>
          <CardTitle className="font-poppins text-xl text-navy flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-sky-blue-500" />
            Game Highlights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notes Input */}
          <div className="space-y-3">
            <Label htmlFor="highlights" className="font-inter font-medium text-navy">
              Notes & Memories (Optional)
            </Label>
            <div className="relative">
              <Textarea
                id="highlights"
                value={gameData.highlights}
                onChange={(e) => updateGameData({ highlights: e.target.value })}
                placeholder="What made this game special? Any funny moments, great plays, or memorable quotes?"
                className="min-h-[120px] font-inter resize-none pr-12"
                rows={5}
              />
              
              {/* Voice Input Button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleVoiceInput}
                className="absolute bottom-2 right-2 h-8 w-8 text-muted-foreground hover:text-sky-blue-500"
                title="Voice input"
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground font-inter">
              Capture the moments that made this game session memorable!
            </p>
          </div>

          {/* Quick Highlights */}
          <div className="space-y-3">
            <Label className="font-inter font-medium text-navy">
              Quick Add
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {quickHighlights.map((highlight, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => addQuickHighlight(highlight)}
                  className="justify-start text-left font-inter text-sm h-auto py-2 px-3 hover:bg-sky-blue-50 hover:border-sky-blue-200 hover:text-sky-blue-700"
                >
                  {highlight}
                </Button>
              ))}
            </div>
          </div>

          {/* Character Count */}
          {gameData.highlights && (
            <div className="text-right">
              <span className="text-xs text-muted-foreground font-inter">
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
    </div>
  );
};

export default HighlightsStep;