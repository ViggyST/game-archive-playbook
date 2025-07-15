
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  return useQuery({
    queryKey: ['players-with-kirito'],
    queryFn: async (): Promise<{ players: PlayerWithKiritoStats[]; summary: PlayersWithKiritoSummary }> => {
      try {
        // First get Kirito's player ID
        const { data: kiritoData, error: kiritoError } = await supabase
          .from('players')
          .select('id')
          .eq('name', 'Kirito')
          .single();

        if (kiritoError || !kiritoData) {
          console.error('Error fetching Kirito:', kiritoError);
          return { players: [], summary: { unique_players_count: 0, most_played_with: [] } };
        }

        const kiritoId = kiritoData.id;

        // Get sessions where Kirito participated
        const { data: kiritoSessions, error: sessionsError } = await supabase
          .from('scores')
          .select('session_id')
          .eq('player_id', kiritoId);

        if (sessionsError) {
          console.error('Error fetching Kirito sessions:', sessionsError);
          return { players: [], summary: { unique_players_count: 0, most_played_with: [] } };
        }

        const sessionIds = kiritoSessions.map(s => s.session_id);

        if (sessionIds.length === 0) {
          return { players: [], summary: { unique_players_count: 0, most_played_with: [] } };
        }

        // Get player stats for those who played with Kirito
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
          .neq('player_id', kiritoId);

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
          const player = score.players;
          
          if (!playerStatsMap.has(playerId)) {
            playerStatsMap.set(playerId, {
              id: player.id,
              name: player.name,
              avatar_url: player.avatar_url,
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
        const players: PlayerWithKiritoStats[] = Array.from(playerStatsMap.values()).map(player => {
          const losses = player.games - player.wins;
          const winRate = player.games > 0 ? Math.round((player.wins / player.games) * 100) : 0;
          
          return {
            id: player.id,
            name: player.name,
            avatar_url: player.avatar_url,
            games_played_with_kirito: player.games,
            wins_with_kirito: player.wins,
            losses_with_kirito: losses,
            win_rate_with_kirito: winRate,
            record: `${player.wins}/${losses}`
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
    staleTime: 5 * 60 * 1000,
  });
};
