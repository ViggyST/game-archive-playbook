
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Clock, Tag, Plus, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { GameData } from "@/pages/LogGame";
import { supabase } from "@/integrations/supabase/client";
import { usePlayerContext } from "@/context/PlayerContext";

interface LogGameStep1Props {
  gameData: GameData;
  updateGameData: (updates: Partial<GameData>) => void;
  onNext: () => void;
  canProceed: boolean;
}

const LogGameStep1 = ({ gameData, updateGameData, onNext, canProceed }: LogGameStep1Props) => {
  const { player } = usePlayerContext();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);

  // Load location suggestions
  useEffect(() => {
    if (player?.id) {
      supabase
        .from('sessions')
        .select('location')
        .not('location', 'is', null)
        .then(({ data }) => {
          if (data) {
            const unique = [...new Set(data.map(s => s.location))].filter(Boolean);
            setLocationSuggestions(unique.slice(0, 5));
          }
        });
    }
  }, [player?.id]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? mins + 'm' : ''}`;
    }
    return `${mins}m`;
  };

  const adjustDuration = (increment: number) => {
    const newDuration = Math.max(15, gameData.duration + increment);
    updateGameData({ duration: newDuration });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
      updateGameData({ date: localDate });
      setIsCalendarOpen(false);
    }
  };

  const complexityColors = {
    Light: 'bg-green-100 text-green-800 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Heavy: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Game Information */}
      <Card>
        <CardHeader>
          <CardTitle className="font-poppins text-xl text-navy flex items-center gap-2">
            <Tag className="h-5 w-5 text-meeple-gold-500" />
            Game Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="font-inter font-medium text-navy">Game Name</Label>
            <div className="mt-2 p-3 bg-muted rounded-lg">
              <span className="font-inter font-semibold text-navy">{gameData.name}</span>
            </div>
          </div>

          <div>
            <Label className="font-inter font-medium text-navy">Complexity</Label>
            <div className="flex gap-3 mt-2">
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
        </CardContent>
      </Card>

      {/* Session Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="font-poppins text-xl text-navy flex items-center gap-2">
            <Clock className="h-5 w-5 text-sky-blue-500" />
            Session Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date */}
          <div>
            <Label className="font-inter font-medium text-navy">Date Played</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-inter mt-2",
                    !gameData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {gameData.date ? format(gameData.date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={gameData.date}
                  onSelect={handleDateSelect}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location" className="font-inter font-medium text-navy">Location</Label>
            <div className="relative mt-2">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                value={gameData.location}
                onChange={(e) => updateGameData({ location: e.target.value })}
                placeholder="Where was the game played?"
                className="pl-10 font-inter"
              />
            </div>
            {locationSuggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {locationSuggestions.map((location, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => updateGameData({ location })}
                    className="text-xs"
                  >
                    {location}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Duration */}
          <div>
            <Label className="font-inter font-medium text-navy">Duration</Label>
            <div className="flex items-center justify-center space-x-4 mt-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => adjustDuration(-15)}
                disabled={gameData.duration <= 15}
                className="h-10 w-10 rounded-full"
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <div className="text-center min-w-[100px]">
                <div className="text-xl font-poppins font-bold text-navy">
                  {formatDuration(gameData.duration)}
                </div>
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => adjustDuration(15)}
                className="h-10 w-10 rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex gap-2 justify-center flex-wrap mt-3">
              {[30, 60, 90, 120, 180].map((duration) => (
                <Button
                  key={duration}
                  variant={gameData.duration === duration ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateGameData({ duration })}
                  className="font-inter text-xs"
                >
                  {formatDuration(duration)}
                </Button>
              ))}
            </div>
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
      </div>
    </div>
  );
};

export default LogGameStep1;
