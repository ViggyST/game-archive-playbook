
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

export const useGameSessionHistory = (gameId: string | null, filterByPlayer?: string) => {
  return useQuery({
    queryKey: ['game-session-history', gameId, filterByPlayer],
    queryFn: async () => {
      if (!gameId) return [];

      console.log('Fetching session history for game:', gameId, 'filterByPlayer:', filterByPlayer);
      
      let query = supabase
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
        .eq('game_id', gameId);

      // If filtering by player, only get sessions where that player participated
      if (filterByPlayer) {
        const { data: playerSessions } = await supabase
          .from('scores')
          .select('session_id')
          .eq('player_id', filterByPlayer);
        
        if (playerSessions && playerSessions.length > 0) {
          const sessionIds = playerSessions.map(ps => ps.session_id);
          query = query.in('id', sessionIds);
        } else {
          // No sessions found for this player and game
          return [];
        }
      }

      const { data: sessions, error } = await query.order('date', { ascending: false });

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
