
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePlayerContext } from "@/context/PlayerContext";

export interface PlayerStats {
  games_played: number;
  games_won: number;
  win_rate: number;
}

export const usePlayerStats = () => {
  const { player } = usePlayerContext();

  return useQuery({
    queryKey: ['player-stats', player?.id],
    queryFn: async (): Promise<PlayerStats> => {
      if (!player?.id) {
        return { games_played: 0, games_won: 0, win_rate: 0 };
      }

      try {
        // 1. Games Played - COUNT(DISTINCT session_id) FROM scores WHERE player_id = player.id
        const { data: scoresData, error: scoresError } = await supabase
          .from('scores')
          .select('session_id')
          .eq('player_id', player.id);
        
        if (scoresError) {
          console.error('Error fetching scores data:', scoresError);
          return { games_played: 0, games_won: 0, win_rate: 0 };
        }

        const uniqueSessions = new Set(scoresData?.map(row => row.session_id) || []);
        const games_played = uniqueSessions.size;

        // 2. Games Won - COUNT(*) FROM scores WHERE is_winner = true AND player_id = player.id
        const { count: games_won, error: wonError } = await supabase
          .from('scores')
          .select('*', { count: 'exact', head: true })
          .eq('is_winner', true)
          .eq('player_id', player.id);
        
        if (wonError) {
          console.error('Error fetching games won:', wonError);
          return { games_played, games_won: 0, win_rate: 0 };
        }

        // 3. Win Rate - Calculate from games played and won
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
    enabled: !!player?.id, // Only run query if we have a player
  });
};
