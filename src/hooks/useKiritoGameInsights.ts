
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export const useKiritoGameInsights = () => {
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);

  useEffect(() => {
    const playerId = localStorage.getItem('active_player');
    setActivePlayerId(playerId);
  }, []);

  return useQuery({
    queryKey: ['player-game-insights', activePlayerId],
    queryFn: async () => {
      if (!activePlayerId) {
        return {
          mostPlayedGame: { name: 'No games yet', count: 0 },
          bestWinRateGame: null,
          worstWinRateGame: null
        };
      }

      console.log('Fetching game insights for player:', activePlayerId);
      
      // Get most played game
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('sessions')
        .select(`
          game_id,
          games (
            name
          )
        `)
        .in('id', 
          await supabase
            .from('scores')
            .select('session_id')
            .eq('player_id', activePlayerId)
            .then(({ data }) => data?.map(score => score.session_id) || [])
        );
      
      if (sessionsError) {
        console.error('Error fetching sessions:', sessionsError);
        throw sessionsError;
      }
      
      // Count games by game_id
      const gamePlayCounts = sessionsData.reduce((acc, session) => {
        const gameId = session.game_id;
        if (gameId) {
          acc[gameId] = (acc[gameId] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);
      
      const mostPlayedGameId = Object.entries(gamePlayCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0];
      
      const mostPlayedGame = sessionsData.find(s => s.game_id === mostPlayedGameId);
      const mostPlayedCount = gamePlayCounts[mostPlayedGameId] || 0;
      
      // Get best and worst win rate games (min 2 plays)
      const { data: winRateData, error: winRateError } = await supabase
        .from('scores')
        .select(`
          session_id,
          is_winner,
          sessions!inner (
            game_id,
            games (
              name
            )
          )
        `)
        .eq('player_id', activePlayerId);
      
      if (winRateError) {
        console.error('Error fetching win rate data:', winRateError);
        throw winRateError;
      }
      
      // Calculate win rates by game
      const gameWinRates = winRateData.reduce((acc, score) => {
        const gameId = score.sessions?.game_id;
        if (gameId) {
          if (!acc[gameId]) {
            acc[gameId] = { 
              wins: 0, 
              total: 0, 
              name: score.sessions?.games?.name || 'Unknown Game'
            };
          }
          acc[gameId].total++;
          if (score.is_winner) {
            acc[gameId].wins++;
          }
        }
        return acc;
      }, {} as Record<string, { wins: number; total: number; name: string }>);
      
      // Filter games with at least 2 plays and calculate win rates
      const eligibleGames = Object.entries(gameWinRates)
        .filter(([, stats]) => stats.total >= 2)
        .map(([gameId, stats]) => ({
          gameId,
          name: stats.name,
          winRate: Math.round((stats.wins / stats.total) * 100),
          plays: stats.total
        }));
      
      const bestWinRateGame = eligibleGames.sort((a, b) => b.winRate - a.winRate)[0];
      const worstWinRateGame = eligibleGames.sort((a, b) => a.winRate - b.winRate)[0];
      
      console.log('Game insights:', {
        mostPlayed: { name: mostPlayedGame?.games?.name, count: mostPlayedCount },
        bestWinRate: bestWinRateGame,
        worstWinRate: worstWinRateGame
      });
      
      return {
        mostPlayedGame: {
          name: mostPlayedGame?.games?.name || 'No games yet',
          count: mostPlayedCount
        },
        bestWinRateGame: bestWinRateGame || null,
        worstWinRateGame: worstWinRateGame || null
      };
    },
    enabled: !!activePlayerId,
  });
};
