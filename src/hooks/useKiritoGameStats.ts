
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface KiritoGameStats {
  name: string;
  weight: string;
  plays: number;
  win_rate: number;
  avg_duration: number;
}

export interface KiritoSummaryStats {
  total_games: number;
  win_rate: number;
  light_games: number;
  medium_games: number;
  heavy_games: number;
}

export const useKiritoGameStats = () => {
  return useQuery({
    queryKey: ['kirito-game-stats'],
    queryFn: async (): Promise<{ games: KiritoGameStats[], summary: KiritoSummaryStats }> => {
      try {
        // First get Kirito's player ID
        const { data: kiritoData, error: kiritoError } = await supabase
          .from('players')
          .select('id')
          .eq('name', 'Kirito')
          .single();

        if (kiritoError || !kiritoData) {
          console.error('Error fetching Kirito:', kiritoError);
          return { games: [], summary: { total_games: 0, win_rate: 0, light_games: 0, medium_games: 0, heavy_games: 0 } };
        }

        const kiritoId = kiritoData.id;

        // Get game-level stats for Kirito
        const { data: gameStats, error: gameStatsError } = await supabase
          .from('scores')
          .select(`
            is_winner,
            sessions!inner(
              duration_minutes,
              complexity,
              games!inner(
                name
              )
            )
          `)
          .eq('player_id', kiritoId);

        if (gameStatsError) {
          console.error('Error fetching game stats:', gameStatsError);
          return { games: [], summary: { total_games: 0, win_rate: 0, light_games: 0, medium_games: 0, heavy_games: 0 } };
        }

        // Group by game and calculate stats
        const gameStatsMap = new Map<string, {
          name: string;
          weight: string;
          sessions: number;
          wins: number;
          total_duration: number;
        }>();

        gameStats.forEach(score => {
          const gameName = score.sessions.games.name;
          const sessionComplexity = score.sessions.complexity || 'medium';
          const normalizedWeight = sessionComplexity.charAt(0).toUpperCase() + sessionComplexity.slice(1);
          
          if (!gameStatsMap.has(gameName)) {
            gameStatsMap.set(gameName, {
              name: gameName,
              weight: normalizedWeight,
              sessions: 0,
              wins: 0,
              total_duration: 0
            });
          }

          const stats = gameStatsMap.get(gameName)!;
          stats.sessions++;
          if (score.is_winner) {
            stats.wins++;
          }
          stats.total_duration += score.sessions.duration_minutes || 0;
        });

        // Convert to final format
        const games: KiritoGameStats[] = Array.from(gameStatsMap.values()).map(game => ({
          name: game.name,
          weight: game.weight,
          plays: game.sessions,
          win_rate: game.sessions > 0 ? Math.round((game.wins / game.sessions) * 100) : 0,
          avg_duration: game.sessions > 0 ? Math.round(game.total_duration / game.sessions) : 0
        })).sort((a, b) => b.plays - a.plays);

        // Calculate summary stats
        const totalGames = games.length;
        const totalSessions = games.reduce((sum, game) => sum + game.plays, 0);
        const totalWins = gameStats.filter(score => score.is_winner).length;
        const overallWinRate = totalSessions > 0 ? Math.round((totalWins / totalSessions) * 100) : 0;

        const lightGames = games.filter(g => g.weight === 'Light').length;
        const mediumGames = games.filter(g => g.weight === 'Medium').length;
        const heavyGames = games.filter(g => g.weight === 'Heavy').length;

        const summary: KiritoSummaryStats = {
          total_games: totalGames,
          win_rate: overallWinRate,
          light_games: lightGames,
          medium_games: mediumGames,
          heavy_games: heavyGames
        };

        return { games, summary };
      } catch (error) {
        console.error('Error in useKiritoGameStats:', error);
        return { games: [], summary: { total_games: 0, win_rate: 0, light_games: 0, medium_games: 0, heavy_games: 0 } };
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};
