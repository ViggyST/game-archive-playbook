
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PlayerGameStats {
  game_name: string;
  sessions_played: number;
  wins: number;
  win_rate: number;
  is_highest_win_rate?: boolean;
  is_lowest_win_rate?: boolean;
}

export const usePlayerGameStats = (playerId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['player-game-stats', playerId],
    queryFn: async (): Promise<PlayerGameStats[]> => {
      try {
        // First get Kirito's player ID
        const { data: kiritoData, error: kiritoError } = await supabase
          .from('players')
          .select('id')
          .eq('name', 'Kirito')
          .single();

        if (kiritoError || !kiritoData) {
          console.error('Error fetching Kirito:', kiritoError);
          return [];
        }

        const kiritoId = kiritoData.id;

        // Get sessions where both Kirito and the selected player participated
        const { data: sharedSessions, error: sessionsError } = await supabase
          .from('scores')
          .select('session_id')
          .eq('player_id', kiritoId);

        if (sessionsError) {
          console.error('Error fetching shared sessions:', sessionsError);
          return [];
        }

        const sessionIds = sharedSessions.map(s => s.session_id);

        if (sessionIds.length === 0) {
          return [];
        }

        // Get game stats for the selected player in those sessions
        const { data: gameStats, error: gameStatsError } = await supabase
          .from('scores')
          .select(`
            is_winner,
            sessions!inner(
              game_id,
              games!inner(
                name
              )
            )
          `)
          .eq('player_id', playerId)
          .in('session_id', sessionIds);

        if (gameStatsError) {
          console.error('Error fetching game stats:', gameStatsError);
          return [];
        }

        // Group by game and calculate stats
        const gameStatsMap = new Map<string, {
          game_name: string;
          sessions: number;
          wins: number;
        }>();

        gameStats.forEach(score => {
          const gameName = score.sessions.games.name;
          
          if (!gameStatsMap.has(gameName)) {
            gameStatsMap.set(gameName, {
              game_name: gameName,
              sessions: 0,
              wins: 0
            });
          }

          const stats = gameStatsMap.get(gameName)!;
          stats.sessions++;
          if (score.is_winner) {
            stats.wins++;
          }
        });

        // Convert to final format and calculate win rates
        const results: PlayerGameStats[] = Array.from(gameStatsMap.values()).map(game => ({
          game_name: game.game_name,
          sessions_played: game.sessions,
          wins: game.wins,
          win_rate: game.sessions > 0 ? Math.round((game.wins / game.sessions) * 100) : 0
        })).sort((a, b) => b.sessions_played - a.sessions_played);

        // Mark highest and lowest win rates
        if (results.length > 0) {
          const gamesWithMultipleSessions = results.filter(g => g.sessions_played >= 2);
          
          // Highest win rate
          const maxWinRate = Math.max(...results.map(g => g.win_rate));
          const highestWinRateGame = results.find(g => g.win_rate === maxWinRate);
          if (highestWinRateGame) {
            highestWinRateGame.is_highest_win_rate = true;
          }

          // Lowest win rate (only for games with 2+ sessions)
          if (gamesWithMultipleSessions.length > 0) {
            const minWinRate = Math.min(...gamesWithMultipleSessions.map(g => g.win_rate));
            const lowestWinRateGame = gamesWithMultipleSessions.find(g => g.win_rate === minWinRate);
            if (lowestWinRateGame) {
              lowestWinRateGame.is_lowest_win_rate = true;
            }
          }
        }

        return results;
      } catch (error) {
        console.error('Error in usePlayerGameStats:', error);
        return [];
      }
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};
