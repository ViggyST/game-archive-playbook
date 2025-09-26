
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePlayerContext } from "@/context/PlayerContext";

export interface MostPlayedGame {
  name: string;
  times_played: number;
}

export const useMostPlayedGame = () => {
  const { player } = usePlayerContext();

  return useQuery({
    queryKey: ['most-played-game', player?.id],
    queryFn: async (): Promise<MostPlayedGame | null> => {
      if (!player?.id) return null;

      // Using scores!inner(...) pattern: sessions without active scores are filtered out
      // This provides cleaner UX by excluding sessions where all scores are soft-deleted
      // Query sessions directly to avoid multi-player session double-counting
      // Use scores!inner to ensure we only get sessions where this player participated
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          game_id,
          games!inner(name),
          scores!inner(player_id)
        `)
        .eq('scores.player_id', player.id)
        .is('deleted_at', null)
        .is('scores.deleted_at', null);

      if (error) {
        console.error('Error fetching most played game:', error);
        return null;
      }

      // Count unique sessions per game (not scores)
      const gameCounts = data.reduce((acc: Record<string, number>, session) => {
        const gameName = session.games?.name;
        if (gameName) {
          acc[gameName] = (acc[gameName] || 0) + 1;
        }
        return acc;
      }, {});

      const mostPlayedEntry = Object.entries(gameCounts).sort(([,a], [,b]) => b - a)[0];
      
      if (!mostPlayedEntry) return null;
      
      return {
        name: mostPlayedEntry[0],
        times_played: mostPlayedEntry[1]
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!player?.id,
  });
};
