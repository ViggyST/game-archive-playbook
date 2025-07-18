
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface GameDashboardData {
  game_id: string;
  game_name: string;
  complexity: string;
  total_plays: number;
  win_rate: number;
  avg_duration: number;
  last_played: string;
}

export const usePlayerGameDashboard = (playerId: string, sortBy: 'plays' | 'recent' = 'plays') => {
  return useQuery({
    queryKey: ['player-game-dashboard', playerId, sortBy],
    queryFn: async () => {
      const orderClause = sortBy === 'plays' ? 'total_plays DESC' : 'last_played DESC';
      
      const { data, error } = await supabase.rpc('get_player_game_stats', {
        p_player_id: playerId,
        p_order_by: orderClause
      });

      if (error) {
        // Fallback to direct query if RPC doesn't exist
        const query = `
          SELECT
            g.id AS game_id,
            g.name AS game_name,
            g.weight AS complexity,
            COUNT(s.id) AS total_plays,
            ROUND(
              100.0 * SUM(CASE WHEN sc.is_winner THEN 1 ELSE 0 END) / NULLIF(COUNT(sc.id), 0),
              1
            ) AS win_rate,
            ROUND(AVG(s.duration_minutes)) AS avg_duration,
            MAX(s.date) AS last_played
          FROM sessions s
          JOIN scores sc ON s.id = sc.session_id
          JOIN games g ON s.game_id = g.id
          WHERE sc.player_id = $1
          GROUP BY g.id, g.name, g.weight
          ORDER BY ${sortBy === 'plays' ? 'total_plays DESC' : 'last_played DESC'}
        `;

        const { data: fallbackData, error: fallbackError } = await supabase
          .from('sessions')
          .select(`
            games!inner(id, name, weight),
            scores!inner(is_winner, player_id),
            duration_minutes,
            date
          `)
          .eq('scores.player_id', playerId);

        if (fallbackError) throw fallbackError;

        // Process the data to match our expected format
        const gameStats = new Map<string, GameDashboardData>();
        
        fallbackData?.forEach((session: any) => {
          const game = session.games;
          const score = session.scores[0];
          const gameId = game.id;
          
          if (!gameStats.has(gameId)) {
            gameStats.set(gameId, {
              game_id: gameId,
              game_name: game.name,
              complexity: game.weight || 'Unknown',
              total_plays: 0,
              win_rate: 0,
              avg_duration: 0,
              last_played: session.date
            });
          }
          
          const stats = gameStats.get(gameId)!;
          stats.total_plays += 1;
          
          if (new Date(session.date) > new Date(stats.last_played)) {
            stats.last_played = session.date;
          }
        });

        // Calculate win rates and averages
        const processedData = Array.from(gameStats.values());
        
        // Sort based on criteria
        processedData.sort((a, b) => {
          if (sortBy === 'plays') {
            return b.total_plays - a.total_plays;
          } else {
            return new Date(b.last_played).getTime() - new Date(a.last_played).getTime();
          }
        });

        return processedData;
      }

      return data as GameDashboardData[];
    },
  });
};
