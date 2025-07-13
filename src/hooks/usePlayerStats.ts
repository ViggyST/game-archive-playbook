
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
      const { data, error } = await supabase.rpc('get_player_stats', { 
        player_name: playerName 
      });
      
      if (error) {
        console.error('Error fetching player stats:', error);
        // Return default values if query fails
        return { games_played: 0, games_won: 0, win_rate: 0 };
      }

      return data?.[0] || { games_played: 0, games_won: 0, win_rate: 0 };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
