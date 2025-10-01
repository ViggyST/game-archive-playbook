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
    queryKey: ['suggested-players', 'global', activePlayer?.id, gameId],
    queryFn: async (): Promise<SuggestedPlayer[]> => {
      if (!activePlayer?.id) return [];

      console.log('Fetching suggested players for:', activePlayer.id);
      
      // STEP 1: Get session IDs where active player participated
      const { data: playerScores, error: scoresError } = await supabase
        .from('scores')
        .select('session_id, sessions!inner(date, game_id, deleted_at)')
        .eq('player_id', activePlayer.id)
        .is('deleted_at', null)
        .is('sessions.deleted_at', null)
        .lte('sessions.date', getCurrentDateIST())
        .order('sessions.date', { ascending: false, foreignTable: 'sessions' })
        .limit(200);

      if (scoresError) {
        console.error('Error fetching player sessions:', scoresError);
        return [];
      }

      if (!playerScores || playerScores.length === 0) {
        // No sessions yet, return only active player
        return [{
          id: activePlayer.id,
          name: activePlayer.name,
          coSessionCount: 0,
          avatar_url: undefined
        }];
      }

      const sessionIds = playerScores.map(s => s.session_id);

      // STEP 2: Get ALL scores from those sessions (all co-players)
      const { data: allScores, error: allScoresError } = await supabase
        .from('scores')
        .select(`
          session_id,
          player_id,
          players!inner(id, name, avatar_url),
          sessions!inner(date, game_id)
        `)
        .in('session_id', sessionIds)
        .is('deleted_at', null);

      if (allScoresError) {
        console.error('Error fetching all scores:', allScoresError);
        return [];
      }

      // Build co-session frequency map
      const coSessionMap = new Map<string, { count: number; lastDate: string; player: any }>();

      allScores?.forEach((score: any) => {
        const playerId = score.player_id;
        const player = score.players;
        const sessionDate = score.sessions.date;

        // Skip self
        if (playerId === activePlayer.id) return;

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

      // Fetch active player's avatar_url
      const { data: activePlayerData } = await supabase
        .from('players')
        .select('id, name, avatar_url')
        .eq('id', activePlayer.id)
        .maybeSingle();

      const activePlayerSuggestion: SuggestedPlayer = {
        id: activePlayer.id,
        name: activePlayer.name,
        coSessionCount: 0,
        avatar_url: activePlayerData?.avatar_url
      };

      // Return active player first, then top 19 ranked others (total 20)
      return [activePlayerSuggestion, ...rankedPlayers.slice(0, 19)];
    },
    enabled: !!activePlayer?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
