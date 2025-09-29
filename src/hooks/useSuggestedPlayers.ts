import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePlayerContext } from "@/context/PlayerContext";

interface SuggestedPlayer {
  id: string;
  name: string;
  avatar_url?: string;
  coSessionCount: number;
  lastCoPlayDate?: string;
}

interface UseSuggestedPlayersParams {
  selectedPlayerIds: string[];
  gameId?: string; // Reserved for future game affinity boost
}

export const useSuggestedPlayers = ({ 
  selectedPlayerIds,
  gameId 
}: UseSuggestedPlayersParams) => {
  const { player: activePlayer } = usePlayerContext();

  return useQuery({
    queryKey: ['suggested-players', 'global', activePlayer?.id, selectedPlayerIds],
    queryFn: async (): Promise<SuggestedPlayer[]> => {
      if (!activePlayer?.id) return [];

      // Fetch last 200 sessions where active player participated
      // Using scores!inner() pattern for soft-delete filtering
      const { data: playerSessionsData, error: sessionsError } = await supabase
        .from('sessions')
        .select(`
          id,
          date,
          scores!inner(
            player_id,
            players!inner(
              id,
              name,
              avatar_url
            )
          )
        `)
        .eq('scores.player_id', activePlayer.id)
        .is('deleted_at', null)
        .is('scores.deleted_at', null)
        .order('date', { ascending: false })
        .limit(200);

      if (sessionsError) {
        console.error('Error fetching suggested players:', sessionsError);
        return [];
      }

      // Build co-session frequency map
      const coSessionMap = new Map<string, { count: number; lastDate: string; player: any }>();

      playerSessionsData?.forEach((session) => {
        const sessionDate = session.date;
        
        // Find all OTHER players in this session
        session.scores?.forEach((score: any) => {
          const otherPlayerId = score.player_id;
          const otherPlayer = score.players;

          // Skip self
          if (otherPlayerId === activePlayer.id) return;
          
          // Skip already selected players
          if (selectedPlayerIds.includes(otherPlayerId)) return;

          if (!coSessionMap.has(otherPlayerId)) {
            coSessionMap.set(otherPlayerId, {
              count: 0,
              lastDate: sessionDate,
              player: otherPlayer
            });
          }

          const entry = coSessionMap.get(otherPlayerId)!;
          entry.count += 1;
          
          // Update last co-play date if this session is more recent
          if (sessionDate > entry.lastDate) {
            entry.lastDate = sessionDate;
          }
        });
      });

      // Convert map to array and sort
      const rankedPlayers = Array.from(coSessionMap.entries())
        .map(([playerId, data]) => ({
          id: playerId,
          name: data.player.name,
          avatar_url: data.player.avatar_url,
          coSessionCount: data.count,
          lastCoPlayDate: data.lastDate
        }))
        .sort((a, b) => {
          // Primary sort: co-session count desc
          if (b.coSessionCount !== a.coSessionCount) {
            return b.coSessionCount - a.coSessionCount;
          }
          // Tiebreaker: most recent co-play date desc
          return (b.lastCoPlayDate || '').localeCompare(a.lastCoPlayDate || '');
        });

      // Return active player first, then top 7 ranked others
      const activePlayerSuggestion: SuggestedPlayer = {
        id: activePlayer.id,
        name: activePlayer.name,
        coSessionCount: 0,
        avatar_url: undefined
      };

      return [activePlayerSuggestion, ...rankedPlayers.slice(0, 7)];
    },
    enabled: !!activePlayer?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
