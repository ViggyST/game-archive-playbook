
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface GameStats {
  name: string;
  plays: number;
  avg_duration: number;
  win_rate: number;
  weight: string;
}

export const useGameStats = () => {
  return useQuery({
    queryKey: ['game-stats'],
    queryFn: async (): Promise<GameStats[]> => {
      const { data, error } = await supabase
        .from('games')
        .select(`
          name,
          weight,
          sessions!inner(
            duration_minutes,
            scores!inner(is_winner)
          )
        `);

      if (error) {
        console.error('Error fetching game stats:', error);
        return [];
      }

      // Process the data to calculate stats
      return data.map(game => {
        const sessions = game.sessions || [];
        const plays = sessions.length;
        
        const totalDuration = sessions.reduce((sum, session) => 
          sum + (session.duration_minutes || 0), 0
        );
        const avgDuration = plays > 0 ? Math.round(totalDuration / plays) : 0;

        const totalScores = sessions.reduce((sum, session) => 
          sum + (session.scores?.length || 0), 0
        );
        const totalWins = sessions.reduce((sum, session) => 
          sum + (session.scores?.filter(score => score.is_winner).length || 0), 0
        );
        const winRate = totalScores > 0 ? Math.round((totalWins / totalScores) * 100) : 0;

        return {
          name: game.name,
          plays,
          avg_duration: avgDuration,
          win_rate: winRate,
          weight: game.weight || 'Medium'
        };
      }).filter(game => game.plays > 0); // Only show games that have been played
    },
    staleTime: 10 * 60 * 1000,
  });
};
