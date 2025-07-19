
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
      
      // Query from scores table where game_id actually exists
      let query = supabase
        .from('scores')
        .select(`
          session_id,
          score,
          is_winner,
          player_id,
          players!inner(name),
          sessions!inner(id, date, location, duration_minutes, highlights)
        `);

      // Apply game_id filter first
      if (gameId) {
        // We need to filter by game_id, but it's not directly on scores table
        // Let's get sessions for this game first, then filter scores
        const { data: gameSessions } = await supabase
          .from('sessions')
          .select('id')
          .eq('game_id', gameId);

        if (!gameSessions || gameSessions.length === 0) {
          return [];
        }

        const sessionIds = gameSessions.map(s => s.id);
        query = query.in('session_id', sessionIds);
      }

      // If filtering by player, only get scores where that player participated
      if (filterByPlayer) {
        query = query.eq('player_id', filterByPlayer);
      }

      const { data: scoresData, error } = await query;

      if (error) {
        console.error('Error fetching session history:', error);
        throw error;
      }

      // Group scores by session_id to create proper session objects
      const sessionsMap = new Map<string, SessionHistoryData>();

      scoresData?.forEach((row) => {
        const session = (row as any).sessions;
        const player = (row as any).players;
        const sessionKey = session.id;

        if (!sessionsMap.has(sessionKey)) {
          sessionsMap.set(sessionKey, {
            session_id: session.id,
            date: session.date,
            location: session.location || 'Unknown Location',
            duration_minutes: session.duration_minutes || 0,
            highlights: session.highlights,
            players: [],
          });
        }

        // Add player to this session
        sessionsMap.get(sessionKey)!.players.push({
          player_name: player?.name || 'Unknown Player',
          score: row.score || 0,
          is_winner: row.is_winner || false,
        });
      });

      // Convert map to array and process sessions
      const processedSessions: SessionHistoryData[] = Array.from(sessionsMap.values()).map((session) => ({
        ...session,
        // Sort players by score (highest first)
        players: session.players.sort((a, b) => b.score - a.score)
      }));

      // Sort sessions by date (most recent first)
      processedSessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      console.log('Processed session history:', processedSessions);
      return processedSessions;
    },
    enabled: !!gameId,
  });
};
