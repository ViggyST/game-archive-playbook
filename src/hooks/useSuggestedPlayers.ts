import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePlayerContext } from "@/context/PlayerContext";
import { getCurrentDateIST } from "@/lib/utils";

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

      // Step 1: Get session IDs where active player participated
      // Using soft-delete filtering and date limit
      const { data: sessionIdsData, error: sessionIdsError } = await supabase
        .from('scores')
        .select('session_id')
        .eq('player_id', activePlayer.id)
        .is('deleted_at', null);

      if (sessionIdsError || !sessionIdsData || sessionIdsData.length === 0) {
        console.error('Error fetching session IDs:', sessionIdsError);
        return [];
      }

      const sessionIds = sessionIdsData.map(s => s.session_id);

      // Step 2: Get ALL scores from those sessions (all players)
      // This gives us complete session data to identify co-players
      const { data: allScoresData, error: scoresError } = await supabase
        .from('scores')
        .select(`
          session_id,
          player_id,
          players!inner(
            id,
            name,
            avatar_url
          ),
          sessions!inner(
            date
          )
        `)
        .in('session_id', sessionIds)
        .is('deleted_at', null)
        .is('sessions.deleted_at', null)
        .lte('sessions.date', getCurrentDateIST())
        .order('sessions.date', { ascending: false })
        .limit(1000);

      if (scoresError) {
        console.error('Error fetching scores:', scoresError);
        return [];
      }

      // Build co-session frequency map
      const coSessionMap = new Map<string, { count: number; lastDate: string; player: any }>();
      const sessionsSeen = new Set<string>();

      allScoresData?.forEach((score: any) => {
        const sessionId = score.session_id;
        const sessionDate = score.sessions?.date;
        const playerId = score.player_id;
        const player = score.players;

        // Skip if no valid session date
        if (!sessionDate) return;

        // Skip self
        if (playerId === activePlayer.id) return;
        
        // Skip already selected players
        if (selectedPlayerIds.includes(playerId)) return;

        // Count unique sessions per player
        const sessionPlayerKey = `${sessionId}-${playerId}`;
        if (!sessionsSeen.has(sessionPlayerKey)) {
          sessionsSeen.add(sessionPlayerKey);

          if (!coSessionMap.has(playerId)) {
            coSessionMap.set(playerId, {
              count: 0,
              lastDate: sessionDate,
              player: player
            });
          }

          const entry = coSessionMap.get(playerId)!;
          entry.count += 1;
          
          // Update last co-play date if this session is more recent
          if (sessionDate > entry.lastDate) {
            entry.lastDate = sessionDate;
          }
        }
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
