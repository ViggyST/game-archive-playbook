
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PlayerStats {
  name: string;
  games_played: number;
  games_won: number;
  win_rate: number;
  avatar_url?: string;
}

export const usePlayersList = () => {
  return useQuery({
    queryKey: ['players-list'],
    queryFn: async (): Promise<PlayerStats[]> => {
      const { data, error } = await supabase
        .from('players')
        .select(`
          name,
          avatar_url,
          scores!inner(
            is_winner
          )
        `);

      if (error) {
        console.error('Error fetching players list:', error);
        return [];
      }

      return data.map(player => {
        const scores = player.scores || [];
        const gamesPlayed = scores.length;
        const gamesWon = scores.filter(score => score.is_winner).length;
        const winRate = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;

        return {
          name: player.name,
          games_played: gamesPlayed,
          games_won: gamesWon,
          win_rate: winRate,
          avatar_url: player.avatar_url || undefined
        };
      }).filter(player => player.games_played > 0); // Only show players who have played games
    },
    staleTime: 10 * 60 * 1000,
  });
};
