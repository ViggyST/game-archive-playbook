
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SessionHistoryData {
  session_id: string;
  date: string;
  location: string;
  duration_minutes: number;
  highlights: string | null;
  players: {
    player_name: string;
    score: number;
    is_winner: boolean;
  }[];
}

export const useGameSessionHistory = (gameId: string | null) => {
  return useQuery({
    queryKey: ['game-session-history', gameId],
    queryFn: async () => {
      if (!gameId) return [];

      console.log('Fetching session history for game:', gameId);
      
      const { data: sessions, error } = await supabase
        .from('sessions')
        .select(`
          id,
          date,
          location,
          duration_minutes,
          highlights,
          scores!inner(
            player_id,
            score,
            is_winner,
            players!inner(name)
          )
        `)
        .eq('game_id', gameId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching session history:', error);
        throw error;
      }

      // Process the data to group players by session
      const processedSessions: SessionHistoryData[] = sessions?.map((session: any) => {
        const players = session.scores.map((score: any) => ({
          player_name: score.players.name,
          score: score.score || 0,
          is_winner: score.is_winner
        }));

        // Sort players by score (highest first)
        players.sort((a, b) => b.score - a.score);

        return {
          session_id: session.id,
          date: session.date,
          location: session.location || 'Unknown Location',
          duration_minutes: session.duration_minutes || 0,
          highlights: session.highlights,
          players
        };
      }) || [];

      console.log('Processed session history:', processedSessions);
      return processedSessions;
    },
    enabled: !!gameId,
  });
};
