import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSuggestedPlayers } from "@/hooks/useSuggestedPlayers";
import { usePlayerContext } from "@/context/PlayerContext";
import { cn } from "@/lib/utils";

interface SuggestedPlayersChipsProps {
  selectedPlayerIds: string[];
  gameId?: string;
  onAddPlayer: (playerId: string, playerName: string, avatarUrl?: string) => void;
}

const AVATAR_COLORS = [
  "bg-gradient-to-br from-sky-blue-400 to-sky-blue-600",
  "bg-gradient-to-br from-meeple-gold-400 to-meeple-gold-600",
  "bg-gradient-to-br from-purple-400 to-purple-600",
  "bg-gradient-to-br from-pink-400 to-pink-600",
  "bg-gradient-to-br from-green-400 to-green-600",
  "bg-gradient-to-br from-orange-400 to-orange-600"
];

const generateAvatar = (name: string, index: number) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  
  const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length];
  
  return { initials, colorClass };
};

export const SuggestedPlayersChips = ({ 
  selectedPlayerIds, 
  gameId,
  onAddPlayer 
}: SuggestedPlayersChipsProps) => {
  const { player: activePlayer } = usePlayerContext();
  const { data: suggestedPlayers, isLoading } = useSuggestedPlayers({
    selectedPlayerIds,
    gameId
  });

  // Filter out active player if already selected
  const filteredSuggestions = suggestedPlayers?.filter(
    (p) => p.id !== activePlayer?.id || !selectedPlayerIds.includes(p.id)
  ) || [];

  // Hide section if no suggestions
  if (!isLoading && filteredSuggestions.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Suggested players
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-32 rounded-full" />
          ))
        ) : (
          // Suggestion chips
          filteredSuggestions.map((player, index) => {
            const isActivePlayer = player.id === activePlayer?.id;
            const { initials, colorClass } = generateAvatar(player.name, index);
            
            return (
              <Button
                key={player.id}
                variant="outline"
                className={cn(
                  "h-auto py-2 px-4 rounded-full",
                  "hover:bg-accent hover:scale-105 transition-all",
                  "focus-visible:ring-2 focus-visible:ring-ring",
                  isActivePlayer && "border-meeple-gold-500 bg-meeple-gold-50"
                )}
                onClick={() => onAddPlayer(player.id, player.name, player.avatar_url)}
                aria-label={`Add ${player.name}`}
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className={cn("text-xs text-white", colorClass)}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex items-center gap-1.5">
                    {isActivePlayer && (
                      <Crown className="h-3 w-3 text-meeple-gold-500 fill-meeple-gold-500" />
                    )}
                    <span className="text-sm font-medium">
                      {isActivePlayer ? 'You' : player.name}
                    </span>
                    {!isActivePlayer && player.coSessionCount > 0 && (
                      <span className="text-xs text-muted-foreground">
                        • {player.coSessionCount} {player.coSessionCount === 1 ? 'play' : 'plays'}
                      </span>
                    )}
                  </div>
                </div>
              </Button>
            );
          })
        )}
      </div>
    </div>
  );
};
