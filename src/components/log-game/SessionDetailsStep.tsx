
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Clock, Minus, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { GameData } from "@/pages/LogGame";

interface SessionDetailsStepProps {
  gameData: GameData;
  updateGameData: (updates: Partial<GameData>) => void;
}

const SessionDetailsStep = ({ gameData, updateGameData }: SessionDetailsStepProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const adjustDuration = (increment: number) => {
    const newDuration = Math.max(15, gameData.duration + increment);
    updateGameData({ duration: newDuration });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Create a new date object with time set to noon in local timezone
      // This prevents timezone conversion issues
      const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
      updateGameData({ date: localDate });
      setIsCalendarOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <Card>
        <CardHeader>
          <CardTitle className="font-poppins text-xl text-navy flex items-center gap-2">
            <Clock className="h-5 w-5 text-sky-blue-500" />
            Session Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Picker */}
          <div className="space-y-2">
            <Label className="font-inter font-medium text-navy">
              Date Played *
            </Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-inter",
                    !gameData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {gameData.date ? format(gameData.date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-[var(--surface)] border-[var(--border)]" align="start">
                <Calendar
                  mode="single"
                  selected={gameData.date}
                  onSelect={handleDateSelect}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="font-inter font-medium text-navy">
              Location *
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                value={gameData.location}
                onChange={(e) => updateGameData({ location: e.target.value })}
                placeholder="Where did you play? (e.g., Home, Café, Board Game Shop)"
                className="pl-10 font-inter"
              />
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-3">
            <Label className="font-inter font-medium text-navy">
              Duration
            </Label>
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => adjustDuration(-15)}
                disabled={gameData.duration <= 15}
                className="h-12 w-12 rounded-full"
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <div className="text-center min-w-[120px]">
                <div className="text-2xl font-poppins font-bold text-navy">
                  {formatDuration(gameData.duration)}
                </div>
                <div className="text-sm text-muted-foreground font-inter">
                  {gameData.duration} minutes
                </div>
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => adjustDuration(15)}
                className="h-12 w-12 rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Quick Duration Buttons */}
            <div className="flex gap-2 justify-center flex-wrap">
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
    </div>
  );
};

export default SessionDetailsStep;
