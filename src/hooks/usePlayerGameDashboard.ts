
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { usePlayerContext } from '@/context/PlayerContext';
import { QUERY_KEYS } from '@/lib/queryKeys';

interface GameDashboardData {
  game_id: string;
  game_name: string;
  complexity: string;
  total_plays: number;
  win_rate: number;
  avg_duration: number;
  last_played: string;
}

export const usePlayerGameDashboard = (sortBy: 'plays' | 'recent' = 'plays') => {
  const { player } = usePlayerContext();

  return useQuery({
    queryKey: QUERY_KEYS.PLAYER_GAME_DASHBOARD(player?.id || '', sortBy),
    queryFn: async () => {
      if (!player?.id) {
        return [];
      }

      // Direct query to get player game stats with soft-delete filtering
      const { data: sessionsData, error } = await supabase
        .from('sessions')
        .select(`
          id,
          game_id,
          date,
          duration_minutes,
          games!inner(id, name, weight),
          scores!inner(player_id, is_winner, score)
        `)
        .eq('scores.player_id', player.id)
        .is('deleted_at', null)  // Exclude soft-deleted sessions
        .is('scores.deleted_at', null);  // Exclude soft-deleted scores

      if (error) {
        console.error('Error fetching player game stats:', error);
        throw error;
      }

      // Process the data to match our expected format
      const gameStats = new Map<string, {
        game_id: string;
        game_name: string;
        complexity: string;
        total_plays: number;
        wins: number;
        total_duration: number;
        last_played: string;
      }>();
      
      sessionsData?.forEach((session: any) => {
        const game = session.games;
        const score = session.scores.find((s: any) => s.player_id === player.id);
        const gameId = game.id;
        
        if (!gameStats.has(gameId)) {
          gameStats.set(gameId, {
            game_id: gameId,
            game_name: game.name,
            complexity: game.weight || 'unknown',
            total_plays: 0,
            wins: 0,
            total_duration: 0,
            last_played: session.date
          });
        }
        
        const stats = gameStats.get(gameId)!;
        stats.total_plays += 1;
        
        if (score?.is_winner) {
          stats.wins += 1;
        }
        
        if (session.duration_minutes) {
          stats.total_duration += session.duration_minutes;
        }
        
        if (new Date(session.date) > new Date(stats.last_played) && 
            new Date(session.date) <= new Date()) {  // Only consider dates up to today
          stats.last_played = session.date;
        }
      });

      // Calculate final stats and convert to expected format
      const processedData: GameDashboardData[] = Array.from(gameStats.values()).map(stats => ({
        game_id: stats.game_id,
        game_name: stats.game_name,
        complexity: stats.complexity,
        total_plays: stats.total_plays,
        win_rate: stats.total_plays > 0 ? Math.round((stats.wins / stats.total_plays) * 100 * 10) / 10 : 0,
        avg_duration: stats.total_plays > 0 ? Math.round(stats.total_duration / stats.total_plays) : 0,
        last_played: stats.last_played
      }));
      
      // Sort based on criteria with proper tie-breaking
      processedData.sort((a, b) => {
        if (sortBy === 'plays') {
          // Most Played: sort by plays (desc), then last_played (desc), then name (asc)
          if (b.total_plays !== a.total_plays) {
            return b.total_plays - a.total_plays;
          }
          const lastPlayedDiff = new Date(b.last_played).getTime() - new Date(a.last_played).getTime();
          if (lastPlayedDiff !== 0) {
            return lastPlayedDiff;
          }
          return a.game_name.localeCompare(b.game_name);
        } else {
          // Last Played: sort by last_played (desc), then plays (desc), then name (asc)
          const lastPlayedDiff = new Date(b.last_played).getTime() - new Date(a.last_played).getTime();
          if (lastPlayedDiff !== 0) {
            return lastPlayedDiff;
          }
          if (b.total_plays !== a.total_plays) {
            return b.total_plays - a.total_plays;
          }
          return a.game_name.localeCompare(b.game_name);
        }
      });

      return processedData;
    },
    enabled: !!player?.id, // Only run query if we have a player
  });
};
