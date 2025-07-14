import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PlayerStats {
  games_played: number;
  games_won: number;
  win_rate: number;
}

export const usePlayerStats = () => {
  return useQuery({
    queryKey: ['player-stats'],
    queryFn: async (): Promise<PlayerStats> => {
      try {
        // 1. Games Played - COUNT(DISTINCT session_id) FROM scores
        const { data: scoresData, error: scoresError } = await supabase
          .from('scores')
          .select('session_id');
        
        if (scoresError) {
          console.error('Error fetching scores data:', scoresError);
          return { games_played: 0, games_won: 0, win_rate: 0 };
        }

        const uniqueSessions = new Set(scoresData?.map(row => row.session_id) || []);
        const games_played = uniqueSessions.size;

        // 2. Games Won - COUNT(*) FROM scores WHERE is_winner = true
        const { count: games_won, error: wonError } = await supabase
          .from('scores')
          .select('*', { count: 'exact', head: true })
          .eq('is_winner', true);
        
        if (wonError) {
          console.error('Error fetching games won:', wonError);
          return { games_played, games_won: 0, win_rate: 0 };
        }

        // 3. Win Rate - ROUND(AVG(CASE WHEN is_winner THEN 1 ELSE 0 END) * 100) FROM scores
        const win_rate = games_played > 0 && games_won ? Math.round((games_won / games_played) * 100) : 0;

        return {
          games_played,
          games_won: games_won || 0,
          win_rate
        };
      } catch (error) {
        console.error('Error in usePlayerStats:', error);
        return { games_played: 0, games_won: 0, win_rate: 0 };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};