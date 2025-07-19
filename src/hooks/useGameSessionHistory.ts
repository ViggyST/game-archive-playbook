
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
          scores(
            player_id,
            score,
            is_winner,
            players(name)
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

      // Process the data to group players by session properly
      const processedSessions: SessionHistoryData[] = sessions?.map((session: any) => {
        // Get unique players for this session (avoid duplicates)
        const playersMap = new Map();
        
        session.scores?.forEach((score: any) => {
          const playerId = score.player_id;
          const playerName = score.players?.name;
          const playerScore = score.score || 0;
          const isWinner = score.is_winner;

          // Only add if we haven't seen this player in this session yet
          if (!playersMap.has(playerId) && playerName) {
            playersMap.set(playerId, {
              player_name: playerName,
              score: playerScore,
              is_winner: isWinner
            });
          }
        });

        // Convert map to array and sort by score (highest first)
        const players = Array.from(playersMap.values())
          .sort((a, b) => b.score - a.score);

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
