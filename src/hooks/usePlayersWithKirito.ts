
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePlayerContext } from "@/context/PlayerContext";

export interface PlayerWithKiritoStats {
  id: string;
  name: string;
  avatar_url?: string;
  games_played_with_kirito: number;
  wins_with_kirito: number;
  losses_with_kirito: number;
  win_rate_with_kirito: number;
  record: string;
}

export interface PlayersWithKiritoSummary {
  unique_players_count: number;
  most_played_with: { name: string; shared_sessions: number }[];
}

export const usePlayersWithKirito = () => {
  const { player } = usePlayerContext();

  return useQuery({
    queryKey: ['players-with-active-player', player?.id],
    queryFn: async (): Promise<{ players: PlayerWithKiritoStats[]; summary: PlayersWithKiritoSummary }> => {
      if (!player?.id) {
        return { players: [], summary: { unique_players_count: 0, most_played_with: [] } };
      }

      try {
        // Get sessions where the active player participated
        const { data: activePlayerSessions, error: sessionsError } = await supabase
          .from('scores')
          .select('session_id')
          .eq('player_id', player.id);

        if (sessionsError) {
          console.error('Error fetching active player sessions:', sessionsError);
          return { players: [], summary: { unique_players_count: 0, most_played_with: [] } };
        }

        const sessionIds = activePlayerSessions.map(s => s.session_id);

        if (sessionIds.length === 0) {
          return { players: [], summary: { unique_players_count: 0, most_played_with: [] } };
        }

        // Get player stats for those who played with the active player
        const { data: playersData, error: playersError } = await supabase
          .from('scores')
          .select(`
            player_id,
            is_winner,
            players!inner(
              id,
              name,
              avatar_url
            )
          `)
          .in('session_id', sessionIds)
          .neq('player_id', player.id);

        if (playersError) {
          console.error('Error fetching players data:', playersError);
          return { players: [], summary: { unique_players_count: 0, most_played_with: [] } };
        }

        // Group by player and calculate stats
        const playerStatsMap = new Map<string, {
          id: string;
          name: string;
          avatar_url?: string;
          games: number;
          wins: number;
        }>();

        playersData.forEach(score => {
          const playerId = score.player_id;
          const playerInfo = score.players;
          
          if (!playerStatsMap.has(playerId)) {
            playerStatsMap.set(playerId, {
              id: playerInfo.id,
              name: playerInfo.name,
              avatar_url: playerInfo.avatar_url,
              games: 0,
              wins: 0
            });
          }

          const stats = playerStatsMap.get(playerId)!;
          stats.games++;
          if (score.is_winner) {
            stats.wins++;
          }
        });

        // Convert to final format
        const players: PlayerWithKiritoStats[] = Array.from(playerStatsMap.values()).map(playerStats => {
          const losses = playerStats.games - playerStats.wins;
          const winRate = playerStats.games > 0 ? Math.round((playerStats.wins / playerStats.games) * 100) : 0;
          
          return {
            id: playerStats.id,
            name: playerStats.name,
            avatar_url: playerStats.avatar_url,
            games_played_with_kirito: playerStats.games,
            wins_with_kirito: playerStats.wins,
            losses_with_kirito: losses,
            win_rate_with_kirito: winRate,
            record: `${playerStats.wins}/${losses}`
          };
        }).sort((a, b) => b.games_played_with_kirito - a.games_played_with_kirito);

        // Calculate summary stats
        const uniquePlayersCount = players.length;
        const mostPlayedWith = players.slice(0, 3).map(p => ({
          name: p.name,
          shared_sessions: p.games_played_with_kirito
        }));

        return {
          players,
          summary: {
            unique_players_count: uniquePlayersCount,
            most_played_with: mostPlayedWith
          }
        };
      } catch (error) {
        console.error('Error in usePlayersWithKirito:', error);
        return { players: [], summary: { unique_players_count: 0, most_played_with: [] } };
      }
    },
    enabled: !!player?.id,
    staleTime: 5 * 60 * 1000,
  });
};
