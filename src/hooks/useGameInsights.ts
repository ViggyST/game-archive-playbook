
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useGameInsights = () => {
  return useQuery({
    queryKey: ['game-insights'],
    queryFn: async (): Promise<string[]> => {
      const insights: string[] = [];

      try {
        // Get most played game
        const { data: mostPlayedData } = await supabase
          .from('sessions')
          .select(`
            games!inner(name)
          `)
          .limit(1000);

        if (mostPlayedData && mostPlayedData.length > 0) {
          const gameCounts = mostPlayedData.reduce((acc: Record<string, number>, session) => {
            const gameName = session.games?.name;
            if (gameName) {
              acc[gameName] = (acc[gameName] || 0) + 1;
            }
            return acc;
          }, {});

          const mostPlayedEntry = Object.entries(gameCounts).sort(([,a], [,b]) => b - a)[0];
          if (mostPlayedEntry) {
            insights.push(`Most played game: ${mostPlayedEntry[0]} with ${mostPlayedEntry[1]} sessions! 🎲`);
          }
        }

        // Get perfect win rate games for current player
        const { data: winRateData } = await supabase
          .from('scores')
          .select(`
            is_winner,
            sessions!inner(
              games!inner(name)
            ),
            players!inner(name)
          `)
          .eq('players.name', 'Vignesh');

        if (winRateData && winRateData.length > 0) {
          const gameStats = winRateData.reduce((acc: Record<string, {wins: number, total: number}>, score) => {
            const gameName = score.sessions?.games?.name;
            if (gameName) {
              if (!acc[gameName]) acc[gameName] = { wins: 0, total: 0 };
              acc[gameName].total++;
              if (score.is_winner) acc[gameName].wins++;
            }
            return acc;
          }, {});

          // Find games with 100% win rate (and at least 2 plays)
          const perfectGames = Object.entries(gameStats)
            .filter(([_, stats]) => stats.total >= 2 && stats.wins === stats.total)
            .map(([game, _]) => game);

          if (perfectGames.length > 0) {
            insights.push(`You have a perfect win rate in ${perfectGames[0]}! 🏆`);
          }

          // Find highest win rate game
          const bestWinRate = Object.entries(gameStats)
            .filter(([_, stats]) => stats.total >= 3)
            .sort(([,a], [,b]) => (b.wins/b.total) - (a.wins/a.total))[0];

          if (bestWinRate) {
            const [game, stats] = bestWinRate;
            const winRate = Math.round((stats.wins / stats.total) * 100);
            if (winRate >= 70) {
              insights.push(`You're dominating in ${game} with ${winRate}% win rate! 💪`);
            }
          }
        }

        // Get total games played
        const { data: totalGamesData } = await supabase
          .from('scores')
          .select(`
            session_id,
            players!inner(name)
          `)
          .eq('players.name', 'Vignesh');

        if (totalGamesData && totalGamesData.length > 0) {
          const uniqueSessions = new Set(totalGamesData.map(row => row.session_id));
          const totalGames = uniqueSessions.size;
          
          if (totalGames >= 10) {
            insights.push(`You've played ${totalGames} games and counting! Keep gaming! 🎮`);
          }
        }

        // Get most frequent opponent
        const { data: opponentData } = await supabase
          .from('scores')
          .select(`
            session_id,
            players!inner(name)
          `);

        if (opponentData && opponentData.length > 0) {
          const sessionPlayers = opponentData.reduce((acc: Record<string, Set<string>>, score) => {
            const sessionId = score.session_id;
            const playerName = score.players?.name;
            if (!acc[sessionId]) acc[sessionId] = new Set();
            if (playerName) acc[sessionId].add(playerName);
            return acc;
          }, {});

          const opponentCounts: Record<string, number> = {};
          Object.values(sessionPlayers).forEach(playerSet => {
            if (playerSet.has('Vignesh') && playerSet.size > 1) {
              playerSet.forEach(player => {
                if (player !== 'Vignesh') {
                  opponentCounts[player] = (opponentCounts[player] || 0) + 1;
                }
              });
            }
          });

          const mostFrequentOpponent = Object.entries(opponentCounts).sort(([,a], [,b]) => b - a)[0];
          if (mostFrequentOpponent) {
            insights.push(`You play most often with ${mostFrequentOpponent[0]}! 👥`);
          }
        }

        // Add fallback insights if we don't have enough
        if (insights.length < 3) {
          insights.push("Your gaming journey is just getting started! 🚀");
          insights.push("Every game tells a story worth remembering 📖");
          insights.push("Track more sessions to unlock personalized insights! 📊");
        }

      } catch (error) {
        console.error('Error fetching insights:', error);
        return [
          "Track more games to unlock personalized insights! 📊",
          "Every session adds to your gaming story! 🎯",
          "Your board game adventure awaits! 🚀"
        ];
      }

      return insights;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
