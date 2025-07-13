
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MostPlayedGame {
  name: string;
  times_played: number;
}

export const useMostPlayedGame = () => {
  return useQuery({
    queryKey: ['most-played-game'],
    queryFn: async (): Promise<MostPlayedGame | null> => {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          games!inner(name)
        `)
        .limit(1000); // Get enough data to count properly

      if (error) {
        console.error('Error fetching most played game:', error);
        return null;
      }

      // Count games manually since we can't use complex GROUP BY with Supabase client
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
  });
};
