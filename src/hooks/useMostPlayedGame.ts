
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MostPlayedGame {
  name: string;
  times_played: number;
}

export const useMostPlayedGame = (playerName: string = 'Kirito') => {
  return useQuery({
    queryKey: ['most-played-game', playerName],
    queryFn: async (): Promise<MostPlayedGame | null> => {
      // First get the player ID
      const { data: playerData, error: playerError } = await supabase
        .from('players')
        .select('id')
        .eq('name', playerName)
        .single();

      if (playerError || !playerData) {
        console.error('Error fetching player:', playerError);
        return null;
      }

      const playerId = playerData.id;

      // Get games for this specific player using the SQL logic from the prompt
      const { data, error } = await supabase
        .from('scores')
        .select(`
          sessions!inner(
            games!inner(name)
          )
        `)
        .eq('player_id', playerId);

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
  });
};
