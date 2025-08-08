import { useEffect, useMemo, useState } from "react";
import { CalendarIcon, MapPin, Timer, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { GameData } from "@/pages/LogGame";
import { supabase } from "@/integrations/supabase/client";
import { usePlayerContext } from "@/context/PlayerContext";

interface Props {
  gameData: GameData;
  updateGameData: (updates: Partial<GameData>) => void;
}

const durationPresets = [30, 60, 90, 120, 180];

export default function GameSessionInfoStep({ gameData, updateGameData }: Props) {
  const { player } = usePlayerContext();
  const [openDate, setOpenDate] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [allLocations, setAllLocations] = useState<string[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Fetch distinct locations scoped to current player if possible
  useEffect(() => {
    let isMounted = true;
    async function fetchLocations() {
      try {
        // Try filtering by a creator column if it exists
        if (player?.id) {
          // Best effort: attempt created_by filter; fallback below if it errors
          const { data, error } = await (supabase as any)
            .from("sessions")
            .select("location")
            .neq("location", null)
            .eq("created_by", player.id);
          if (!error && data && isMounted) {
            const unique = Array.from(new Set<string>((data as any[]).map((d: any) => String(d.location)).filter(Boolean)));
            setAllLocations(unique);
            return;
          }
        }
        // Fallback: fetch without creator filter
        const { data } = await supabase.from("sessions").select("location").neq("location", null).limit(100);
        if (data && isMounted) {
          const unique = Array.from(new Set<string>((data as any[]).map((d: any) => String(d.location)).filter(Boolean)));
          setAllLocations(unique);
        }
      } catch {
        // Ignore errors and keep suggestions empty
      }
    }
    fetchLocations();
    return () => {
      isMounted = false;
    };
  }, [player?.id]);

  const filteredLocations = useMemo(() => {
    const q = locationQuery.trim().toLowerCase();
    if (!q) return allLocations.slice(0, 8);
    return allLocations.filter((loc) => String(loc).toLowerCase().includes(q)).slice(0, 8);
  }, [allLocations, locationQuery]);

  const handleSelectLocation = (loc: string) => {
    updateGameData({ location: loc });
    setLocationQuery(loc);
    setShowLocationDropdown(false);
  };

  const handleDateSelect = (date?: Date) => {
    if (!date) return;
    // Normalize to noon to avoid timezone shifts
    const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
    updateGameData({ date: normalized });
    setOpenDate(false);
  };

  const selectDuration = (minutes: number) => updateGameData({ duration: minutes });
  const adjustDuration = (delta: number) => {
    const next = Math.max(15, (gameData.duration || 0) + delta);
    updateGameData({ duration: next });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="font-poppins text-xl text-foreground flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            Game Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Game Name */}
          <div className="space-y-2">
            <Label htmlFor="gameName" className="font-inter font-medium text-foreground">
              Game
            </Label>
            <Input
              id="gameName"
              value={gameData.name}
              onChange={(e) => updateGameData({ name: e.target.value })}
              placeholder="Enter game name"
              className="font-inter h-12"
            />
          </div>

          {/* Complexity */}
          <div className="space-y-3">
            <Label className="font-inter font-medium text-foreground">Complexity</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["Light", "Medium", "Heavy"] as const).map((c) => {
                const isActive = gameData.complexity === c;
                return (
                  <Button
                    key={c}
                    type="button"
                    variant={isActive ? "default" : "outline"}
                    className={cn(
                      "h-12 w-full rounded-full font-inter text-sm",
                      isActive ? "" : "bg-muted text-muted-foreground"
                    )}
                    onClick={() => updateGameData({ complexity: c })}
                  >
                    {c}
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-poppins text-xl text-foreground flex items-center gap-2">
            <Timer className="h-5 w-5 text-primary" />
            Session Metadata
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Played */}
          <div className="space-y-2">
            <Label className="font-inter font-medium text-foreground">Date Played</Label>
            <Popover open={openDate} onOpenChange={setOpenDate}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-12 w-full justify-start text-left font-normal",
                    !gameData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {gameData.date ? format(gameData.date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0 z-50">
                <Calendar
                  mode="single"
                  selected={gameData.date}
                  onSelect={handleDateSelect}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Location */}
          <div className="space-y-2 relative">
            <Label htmlFor="location" className="font-inter font-medium text-foreground">
              Location
            </Label>
            <div className="relative">
              <Input
                id="location"
                value={gameData.location}
                onChange={(e) => {
                  const v = e.target.value;
                  setLocationQuery(v);
                  updateGameData({ location: v });
                  setShowLocationDropdown(true);
                }}
                onFocus={() => setShowLocationDropdown(true)}
                onBlur={() => setTimeout(() => setShowLocationDropdown(false), 120)}
                placeholder="Where was the game played?"
                className="font-inter h-12 pr-10"
              />
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              {showLocationDropdown && filteredLocations.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-popover text-popover-foreground border border-border rounded-lg shadow-md z-50 max-h-60 overflow-auto">
                  {filteredLocations.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground font-inter text-sm"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelectLocation(loc)}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-3">
            <Label className="font-inter font-medium text-foreground">Duration</Label>
            <div className="grid grid-cols-5 gap-2">
              {durationPresets.map((m) => {
                const isActive = gameData.duration === m;
                return (
                  <Button
                    key={m}
                    type="button"
                    variant={isActive ? "default" : "outline"}
                    className={cn("h-12 w-full rounded-full text-sm", !isActive && "bg-muted text-muted-foreground")}
                    onClick={() => selectDuration(m)}
                  >
                    {m < 60 ? `${m}m` : m % 60 === 0 ? `${m / 60}h` : `${Math.floor(m / 60)}h ${m % 60}m`}
                  </Button>
                );
              })}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" type="button" className="h-10" onClick={() => adjustDuration(-15)}>
                −15m
              </Button>
              <div className="flex-1 text-center text-sm text-muted-foreground">
                Current: {gameData.duration < 60
                  ? `${gameData.duration}m`
                  : gameData.duration % 60 === 0
                  ? `${gameData.duration / 60}h`
                  : `${Math.floor(gameData.duration / 60)}h ${gameData.duration % 60}m`}
              </div>
              <Button variant="outline" type="button" className="h-10" onClick={() => adjustDuration(15)}>
                +15m
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
