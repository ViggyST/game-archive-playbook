import { useEffect, useMemo, useState } from "react";
import { CalendarIcon, MapPin, Timer, Gamepad2, Target } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { GameData } from "@/pages/LogGame";
import { supabase } from "@/integrations/supabase/client";
import { usePlayerContext } from "@/context/PlayerContext";
import { useGameCatalogSearch } from "@/hooks/useGameCatalogSearch";

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

  // Game name autocomplete
  const [gameQuery, setGameQuery] = useState<string>(gameData.name || "");
  const [showGameDropdown, setShowGameDropdown] = useState(false);
  const gameSearch = useGameCatalogSearch(gameQuery);
  const gameSuggestions = gameSearch.data || [];

  // Location quick chips
  const [quickLocationChips, setQuickLocationChips] = useState<string[]>([]);

  // Show complexity only when game name is being typed or has value
  const showComplexity = gameData.name && gameData.name.length > 0;

  // Fetch distinct locations and quick chips scoped to current player
  useEffect(() => {
    let isMounted = true;
    async function fetchLocations() {
      try {
        const processLocations = (rows: any[]) => {
          const locations = (rows || []).map((d: any) => String(d.location)).filter(Boolean);
          const unique = Array.from(new Set<string>(locations));
          const counts: Record<string, number> = {};
          locations.forEach((loc) => {
            counts[loc] = (counts[loc] || 0) + 1;
          });
          const top3 = Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([loc]) => loc);
          if (isMounted) {
            setAllLocations(unique);
            setQuickLocationChips(top3);
          }
        };

        // Try filtering by player if possible
        if (player?.id) {
          const { data, error } = await (supabase as any)
            .from("sessions")
            .select("location")
            .neq("location", null)
            .eq("created_by", player.id)
            .limit(200);
          if (!error && data) {
            processLocations(data as any[]);
            return;
          }
        }
        // Fallback: fetch without creator filter
        const { data } = await supabase
          .from("sessions")
          .select("location")
          .neq("location", null)
          .limit(200);
        if (data) processLocations(data as any[]);
      } catch {
        // Ignore errors and keep suggestions empty
      }
    }
    fetchLocations();
    return () => {
      isMounted = false;
    };
  }, [player?.id]);

  // Prefill complexity from existing game's default weight
  useEffect(() => {
    if (!gameData.name || gameData.name.trim().length < 3 || gameData.complexity !== undefined) return;
    
    let isMounted = true;
    async function prefillComplexity() {
      try {
        const { data: existingGame } = await supabase
          .from('games')
          .select('weight')
          .ilike('name', gameData.name)
          .maybeSingle();
        
        if (existingGame?.weight && isMounted) {
          const complexity = existingGame.weight.charAt(0).toUpperCase() + 
                            existingGame.weight.slice(1).toLowerCase();
          updateGameData({ 
            complexity: complexity as 'Light' | 'Medium' | 'Heavy' 
          });
        }
      } catch (err) {
        console.error('Error prefilling complexity:', err);
      }
    }
    
    const timeoutId = setTimeout(prefillComplexity, 500);
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [gameData.name, gameData.complexity, updateGameData]);

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

  // Helper function to format duration for display
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
  };

  return (
    <div className="px-5 py-4 animate-fade-in">
      <Card className="shadow-sm border-border/60">
        <CardHeader className="pb-4">
          <CardTitle className="font-inter text-lg font-semibold text-foreground">
            Game Session Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Game Name */}
          <div className="space-y-2 relative">
            <div className="flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-blue-600" />
              <Label htmlFor="gameName" className="font-inter text-sm font-medium text-gray-700">
                Game
              </Label>
            </div>
            <div className="relative">
              <Input
                id="gameName"
                value={gameData.name}
                onChange={(e) => {
                  const v = e.target.value;
                  updateGameData({ name: v });
                  setGameQuery(v);
                  setShowGameDropdown(true);
                }}
                onFocus={() => setShowGameDropdown(true)}
                onBlur={() => setTimeout(() => setShowGameDropdown(false), 120)}
                placeholder="Enter game name"
                className="h-12 text-base border border-gray-200 rounded-lg focus:border-primary"
              />
              {showGameDropdown && gameQuery.trim().length >= 2 && gameSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-md z-50 max-h-72 overflow-auto">
                  {gameSuggestions.map((g: any) => (
                    <button
                      key={g.game_id}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        updateGameData({ name: g.title });
                        setGameQuery(g.title);
                        setShowGameDropdown(false);
                      }}
                    >
                      {g.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Complexity - only show when game name exists */}
          {showComplexity && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-500" />
                <Label className="font-inter text-sm font-medium text-gray-700">
                  Complexity
                </Label>
              </div>
              <div className="flex gap-2">
                {(["Light", "Medium", "Heavy"] as const).map((c) => {
                  const isActive = gameData.complexity === c;
                  return (
                    <Button
                      key={c}
                      type="button"
                      variant="outline"
                      className={cn(
                        "h-9 px-4 rounded-full text-sm font-medium min-w-16",
                        isActive
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500 hover:from-orange-600 hover:to-orange-700"
                          : "border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100"
                      )}
                      onClick={() => updateGameData({ complexity: c })}
                    >
                      {c}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Date Played */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              <Label className="font-inter text-sm font-medium text-gray-700">Date Played</Label>
            </div>
            <Popover open={openDate} onOpenChange={setOpenDate}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-12 w-full justify-start text-left font-normal border-gray-200 rounded-lg",
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
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Location */}
          <div className="space-y-2 relative">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-600" />
              <Label htmlFor="location" className="font-inter text-sm font-medium text-gray-700">
                Location
              </Label>
            </div>
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
                className="h-12 text-base border border-gray-200 rounded-lg focus:border-primary pr-10"
              />
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

              {showLocationDropdown && locationQuery.trim().length >= 2 && filteredLocations.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-md z-50 max-h-60 overflow-auto">
                  {filteredLocations.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelectLocation(loc)}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Location Quick Chips - below input */}
            {quickLocationChips.length > 0 && (
              <div className="flex gap-2 flex-wrap pt-1">
                {quickLocationChips.map((chip) => (
                  <Button
                    key={chip}
                    type="button"
                    variant="outline"
                    className="h-8 px-3 rounded-full text-sm border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100"
                    onClick={() => handleSelectLocation(chip)}
                  >
                    {chip}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Duration */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-green-600" />
              <Label className="font-inter text-sm font-medium text-gray-700">Duration</Label>
            </div>
            
            {/* Slider */}
            <div className="space-y-2">
              <div className="relative">
                <Slider
                  value={[gameData.duration || 90]}
                  onValueChange={(values) => selectDuration(values[0])}
                  min={15}
                  max={360}
                  step={15}
                  className="w-full"
                />
                {/* Duration label above slider */}
                <div className="flex justify-center mt-1">
                  <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {formatDuration(gameData.duration || 90)}
                  </span>
                </div>
              </div>
            </div>

            {/* Preset Pills */}
            <div className="flex gap-2 flex-wrap">
              {durationPresets.map((m) => {
                const isActive = gameData.duration === m;
                return (
                  <Button
                    key={m}
                    type="button"
                    variant="outline"
                    className={cn(
                      "h-9 px-4 rounded-full text-sm font-medium min-w-16 transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500 hover:from-orange-600 hover:to-orange-700"
                        : "border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100"
                    )}
                    onClick={() => selectDuration(m)}
                  >
                    {formatDuration(m)}
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
