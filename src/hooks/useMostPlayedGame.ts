
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePlayerContext } from "@/context/PlayerContext";
import { QUERY_KEYS } from "@/lib/queryKeys";

export interface MostPlayedGame {
  name: string;
  times_played: number;
}

export const useMostPlayedGame = () => {
  const { player } = usePlayerContext();

  return useQuery({
    queryKey: QUERY_KEYS.MOST_PLAYED_GAME(player?.id || ''),
    queryFn: async (): Promise<MostPlayedGame | null> => {
      if (!player?.id) return null;

      // Get games for this specific player with soft-delete filtering
      const { data, error } = await supabase
        .from('scores')
        .select(`
          sessions!inner(
            games!inner(name)
          )
        `)
        .eq('player_id', player.id)
        .is('deleted_at', null)  // Exclude soft-deleted scores
        .is('sessions.deleted_at', null);  // Exclude soft-deleted sessions

      if (error) {
        console.error('Error fetching most played game:', error);
        return null;
      }

      // Count games manually since we can't use complex GROUP BY with Supabase client
      const gameCounts = data.reduce((acc: Record<string, number>, score) => {
        const gameName = score.sessions?.games?.name;
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
