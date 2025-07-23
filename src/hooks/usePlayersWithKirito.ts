
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

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
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);

  useEffect(() => {
    const playerId = localStorage.getItem('active_player');
    setActivePlayerId(playerId);
  }, []);

  return useQuery({
    queryKey: ['players-with-active-player', activePlayerId],
    queryFn: async (): Promise<{ players: PlayerWithKiritoStats[]; summary: PlayersWithKiritoSummary }> => {
      if (!activePlayerId) {
        return { players: [], summary: { unique_players_count: 0, most_played_with: [] } };
      }

      try {
        // Get sessions where the active player participated
        const { data: activePlayerSessions, error: sessionsError } = await supabase
          .from('scores')
          .select('session_id')
          .eq('player_id', activePlayerId);

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
          .neq('player_id', activePlayerId);

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
    enabled: !!activePlayerId,
    staleTime: 5 * 60 * 1000,
  });
};
