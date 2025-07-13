
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PlayerStats {
  games_played: number;
  games_won: number;
  win_rate: number;
}

export const usePlayerStats = (playerName: string = 'Vignesh') => {
  return useQuery({
    queryKey: ['player-stats', playerName],
    queryFn: async (): Promise<PlayerStats> => {
      // Query to get player stats using the SQL from the knowledge base
      const { data, error } = await supabase
        .from('scores')
        .select(`
          session_id,
          is_winner,
          sessions!inner(id),
          players!inner(name)
        `)
        .eq('players.name', playerName);
      
      if (error) {
        console.error('Error fetching player stats:', error);
        return { games_played: 0, games_won: 0, win_rate: 0 };
      }

      if (!data || data.length === 0) {
        return { games_played: 0, games_won: 0, win_rate: 0 };
      }

      // Calculate stats from the data
      const uniqueSessions = new Set(data.map(row => row.session_id));
      const games_played = uniqueSessions.size;
      const games_won = data.filter(row => row.is_winner === true).length;
      const win_rate = games_played > 0 ? Math.round((games_won / games_played) * 100) : 0;

      return {
        games_played,
        games_won,
        win_rate
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
